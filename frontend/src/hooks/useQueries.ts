import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SimplifiedSummary, ReportId, Medication, ActionStep } from '../backend';

// Fetch all history records
export function useGetHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, string, bigint]>>({
    queryKey: ['history'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHistory();
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
