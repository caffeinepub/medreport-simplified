import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SimplifiedSummary {
    actionSteps: Array<ActionStep>;
    medications: Array<Medication>;
    keyFindings: Array<string>;
}
export type ReportId = bigint;
export interface ActionStep {
    description: string;
}
export type Time = bigint;
export interface Medication {
    dosage: string;
    name: string;
    purpose: string;
}
export interface backendInterface {
    deleteReport(reportId: ReportId): Promise<void>;
    getHistory(): Promise<Array<[Time, string, ReportId, boolean]>>;
    getSummary(reportId: ReportId): Promise<SimplifiedSummary>;
    submitReport(reportText: string, prescriptionText: string, keyFindings: Array<string>, medications: Array<Medication>, actionSteps: Array<ActionStep>): Promise<ReportId>;
    toggleBookmark(reportId: ReportId): Promise<void>;
}
