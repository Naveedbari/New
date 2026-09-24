/** Mirrors HousingMap.Api.Contracts.SystemInfoResponse (GET /api/v1/system/info). */
export interface SystemInfo {
  readonly apiVersion: string;
  readonly environment: string;
  readonly activeDataset: ActiveDataset | null;
}

export interface ActiveDataset {
  readonly version: string;
  readonly name: string;
  readonly crs: string;
  readonly isDevelopmentData: boolean;
  readonly publishedAt: string | null;
  readonly featureCounts: DatasetFeatureCounts;
}

export interface DatasetFeatureCounts {
  readonly sectors: number;
  readonly blocks: number;
  readonly streets: number;
  readonly roads: number;
  readonly plots: number;
  readonly pointsOfInterest: number;
}
