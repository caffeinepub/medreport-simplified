import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
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
  };

  var nextId : ReportId = 1;

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

  // Add a new report and its simplified summary
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
    };

    records.add(reportId, record);
    reportId;
  };

  // Get the full simplified summary for a specific report
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

  // Get a list of all processed reports in reverse-chronological order
  public query ({ caller }) func getHistory() : async [(Time.Time, Text, ReportId)] {
    records.values().toArray().sort().map(
      func(record) {
        let excerpt = if (record.simplifiedSummary.keyFindings.size() > 0) {
          record.simplifiedSummary.keyFindings[0];
        } else {
          "";
        };
        (record.timestamp, excerpt, record.id);
      }
    );
  };
};
