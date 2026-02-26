import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";



actor {
  type ReportId = Nat;

  type Medication = {
    name : Text;
    purpose : Text;
    dosage : Text;
  };

  type ActionStep = {
    description : Text;
  };

  type SimplifiedSummary = {
    keyFindings : [Text];
    medications : [Medication];
    actionSteps : [ActionStep];
  };

  type ReportRecord = {
    id : ReportId;
    timestamp : Time.Time;
    originalReportText : Text;
    originalPrescriptionText : Text;
    simplifiedSummary : SimplifiedSummary;
    isBookmarked : Bool;
  };

  module ReportRecord {
    public func compare(record1 : ReportRecord, record2 : ReportRecord) : Order.Order {
      if (record1.timestamp > record2.timestamp) {
        #less;
      } else if (record1.timestamp < record2.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  let records = Map.empty<ReportId, ReportRecord>();
  var nextId : ReportId = 1;

  // Add new report and summary
  public shared ({ caller }) func submitReport(reportText : Text, prescriptionText : Text, keyFindings : [Text], medications : [Medication], actionSteps : [ActionStep]) : async ReportId {
    let reportId = nextId;
    nextId += 1;

    let summary : SimplifiedSummary = {
      keyFindings;
      medications;
      actionSteps;
    };

    let record : ReportRecord = {
      id = reportId;
      timestamp = Time.now();
      originalReportText = reportText;
      originalPrescriptionText = prescriptionText;
      simplifiedSummary = summary;
      isBookmarked = false;
    };

    records.add(reportId, record);
    reportId;
  };

  public query ({ caller }) func getSummary(reportId : ReportId) : async SimplifiedSummary {
    switch (records.get(reportId)) {
      case (null) {
        Runtime.trap("Could not find report with id " # reportId.toText());
      };
      case (?record) {
        record.simplifiedSummary;
      };
    };
  };

  public query ({ caller }) func getHistory() : async [(Time.Time, Text, ReportId, Bool)] {
    records.values().toArray().sort().map(
      func(record) {
        let excerpt = if (record.simplifiedSummary.keyFindings.size() > 0) {
          record.simplifiedSummary.keyFindings[0];
        } else {
          "";
        };
        (record.timestamp, excerpt, record.id, record.isBookmarked);
      }
    );
  };

  public shared ({ caller }) func toggleBookmark(reportId : ReportId) : async () {
    switch (records.get(reportId)) {
      case (null) {
        Runtime.trap("Could not find report with id " # reportId.toText());
      };
      case (?record) {
        let updatedReport = { record with isBookmarked = not record.isBookmarked };
        records.add(reportId, updatedReport);
      };
    };
  };

  public shared ({ caller }) func deleteReport(reportId : ReportId) : async () {
    if (not records.containsKey(reportId)) {
      Runtime.trap("Could not find report with id " # reportId.toText());
    };
    records.remove(reportId);
  };
};
