import { Injectable, Inject } from "@nestjs/common";
import Analytics from "analytics-node";
import { SegmentAnalyticsOptions } from "./segmentAnalytics.interfaces";

export enum EnumEventType {
  Signup = "Signup",
  WorkspacePlanUpgradeRequest = "WorkspacePlanUpgradeRequest",
  WorkspacePlanUpgradeCompleted = "WorkspacePlanUpgradeCompleted",
  WorkspacePlanDowngradeRequest = "WorkspacePlanDowngradeRequest",
  CommitCreate = "commit",
  WorkspaceSelected = "selectWorkspace",
  GitHubAuthResourceComplete = "completeAuthResourceWithGitHub",
  ServiceWizardServiceGenerated = "ServiceWizard_ServiceGenerated",
  SubscriptionLimitPassed = "SubscriptionLimitPassed",
  EntityCreate = "createEntity",
  EntityUpdate = "updateEntity",
  EntityFieldCreate = "createEntityField",
  EntityFieldUpdate = "updateEntityField",
  PluginInstall = "installPlugin",
  PluginUpdate = "updatePlugin",
  DemoRepoCreate = "CreateDemoRepo",
}

export type IdentifyData = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};

export type TrackData = {
  userId: string;
  event: EnumEventType;
  properties?:
    | {
        [key: string]: unknown;
      }
    | undefined;
  context?: {
    traits?: IdentifyData;
  };
};

@Injectable()
export class SegmentAnalyticsService {
  private analytics: Analytics;

  constructor(
    @Inject("SEGMENT_ANALYTICS_OPTIONS")
    private options: SegmentAnalyticsOptions
  ) {
    if (options && options.segmentWriteKey && options.segmentWriteKey.length) {
      this.analytics = new Analytics(this.options.segmentWriteKey);
    }
  }

  public async identify(data: IdentifyData): Promise<void> {
    if (!this.analytics) return;

    const { userId, ...rest } = data;

    this.analytics.identify({
      userId: userId,
      traits: rest,
    });
  }

  public async track(data: TrackData): Promise<void> {
    if (!this.analytics) return;
    this.analytics.track({
      ...data,
      properties: {
        ...data.properties,
        source: "amplication-server",
      },
    });
  }
}
