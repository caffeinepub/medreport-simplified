import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SimplifiedSummary, ReportId, Medication, ActionStep } from '../backend';

// Fetch all history records — returns [timestamp, excerpt, reportId, isBookmarked]
export function useGetHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, string, bigint, boolean]>>({
    queryKey: ['history'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHistory() as Promise<Array<[bigint, string, bigint, boolean]>>;
    },
    enabled: !!actor && !isFetching,
  });
}

// Fetch a single summary by report ID
export function useGetSummary(reportId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<SimplifiedSummary | null>({
    queryKey: ['summary', reportId?.toString()],
    queryFn: async () => {
      if (!actor || reportId === null) return null;
      return actor.getSummary(reportId);
    },
    enabled: !!actor && !isFetching && reportId !== null,
  });
}

// Submit a new report
export function useSubmitReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<
    ReportId,
    Error,
    {
      reportText: string;
      prescriptionText: string;
      keyFindings: string[];
      medications: Medication[];
      actionSteps: ActionStep[];
    }
  >({
    mutationFn: async ({ reportText, prescriptionText, keyFindings, medications, actionSteps }) => {
      if (!actor) throw new Error('Backend not available');
      return actor.submitReport(reportText, prescriptionText, keyFindings, medications, actionSteps);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

// Toggle bookmark/favourite state for a report
export function useToggleBookmark() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, bigint>({
    mutationFn: async (reportId: bigint) => {
      if (!actor) throw new Error('Backend not available');
      return actor.toggleBookmark(reportId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

// Delete a report by ID
export function useDeleteReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, bigint>({
    mutationFn: async (reportId: bigint) => {
      if (!actor) throw new Error('Backend not available');
      return actor.deleteReport(reportId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}
