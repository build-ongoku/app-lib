import { NavLink, Tooltip, Text, Group, Box } from "@mantine/core";
import { App, Service } from "../../core";
import { useApp } from "../../providers/index-client";
import { addBaseURL } from "../../utils";
import { FiExternalLink } from "react-icons/fi";
import { useAuth } from "../../providers/index-client";
import { useMakeRequest } from "../../utils/api/index-client";
import { ServerResponseWrapper } from "../components";
import React from "react";

export const AppNavBar = (props: {}) => {
  // Get the app
  const { ongokuApp, loading, error } = useApp();
  
  // Handle loading state
  if (loading) {
    return (
      <div style={{ padding: "16px", textAlign: "center" }}>
        <Text>Loading application data...</Text>
      </div>
    );
  }
  
  // Handle error state
  if (error || !ongokuApp) {
    return (
      <div style={{ padding: "16px" }}>
        <Text color="red">Error loading application data</Text>
        <Text size="sm" color="dimmed">
          {error?.message || "App not initialized"}
        </Text>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      <div className="flex-grow">
        {/* Services (non-builtin) */}
        <NavLink key={"services"} label={"Application"}>
          <NavLinksInnerForServices
            appInfo={ongokuApp}
            svcs={ongokuApp.services.filter((svc) => svc.source !== "mod")}
          />
        </NavLink>

        {/* Services (built-in) */}
        <NavLink key={"services-builtin"} label={"Built In"}>
          <NavLinksInnerForServices
            appInfo={ongokuApp}
            svcs={ongokuApp.services.filter((svc) => svc.source === "mod")}
          />
        </NavLink>

        <NavLink
          key={"api-docs"}
          target="_blank"
          href={addBaseURL("/v2/docs")}
          label={
            <>
              {"API Documentation"} <FiExternalLink />
            </>
          }
        ></NavLink>
      </div>

      {/* User and API Status Information */}
      <NavbarFooter />
    </div>
  );
};

interface ServerInfo {
  appInfo: {
    compilationTimestamp: Date;
    gitCommitHash: string;
    gitCommitBranch: string;
    semanticVersion: string;
  };
  ongokuInfo: {
    compilationTimestamp: Date;
    gitCommitHash: string;
    gitCommitBranch: string;
    semanticVersion: string;
    codeGenerationTimestamp: Date;
  };
}

// Component for the Navbar footer with user and API status
const NavbarFooter = () => {
  // Get the user from the session
  const { user } = useAuth();

  const apiStatusCall = useMakeRequest<ServerInfo, { stub: string }>({
    relativePath: "/v1/info",
    method: "GET",
    data: {
      stub: "",
    },
  });

  return (
    <Box className="mt-auto border-t border-gray-200 p-3">
      <Group className="mb-2 flex justify-between">
        <ServerResponseWrapper
          error={apiStatusCall.error || apiStatusCall.resp?.error}
          loading={apiStatusCall.loading}
        >
          <Text className="text-xs text-gray-500">
            ongoku v{apiStatusCall.resp?.data?.ongokuInfo.semanticVersion} (
            {apiStatusCall.resp?.data?.ongokuInfo.gitCommitHash?.substring(
              0,
              10
            )}
            )
          </Text>
        </ServerResponseWrapper>
      </Group>
    </Box>
  );
};

const NavLinksInnerForServices = (props: { appInfo: App; svcs: Service[] }) => {
  const { appInfo, svcs } = props;

  return (
    <>
      {svcs.map((svc) => {
        return (
          <NavLinksForService
            key={svc.getName().toRaw()}
            appInfo={appInfo}
            svc={svc}
          />
        );
      })}
    </>
  );
};
const NavLinksForService = (props: { appInfo: App; svc: Service }) => {
  const { appInfo, svc } = props;

  const entities = appInfo.getServiceEntities(svc.namespace.toRaw());
  const methods = appInfo.getServiceMethods(svc.namespace.toRaw());
  if (methods.length > 0) {
    console.log(
      "[NavLinksForService] svc",
      svc.getName().toRaw(),
      "methods",
      methods,
      "mthdToString",
      methods[0].namespace.toString(),
      "mthdToURLPath",
      methods[0].namespace.toURLPath()
    );
  }

  let svcLabel = svc.description ? (
    <Tooltip label={svc.description}>
      <span>{svc.getNameFriendly()}</span>
    </Tooltip>
  ) : (
    svc.getNameFriendly()
  );

  return (
    <NavLink
      key={svc.getName().toRaw()}
      href={`svc-${svc.getName().toRaw()}`}
      label={svcLabel}
    >
      {/* Service - Entities */}
      {(entities.length > 0 &&
        entities.map((ent) => {
          return (
            <NavLink
              key={ent.namespace.toString()}
              href={`${ent.namespace.toURLPath()}/list`}
              label={ent.getNameFriendly()}
            />
          );
        })) || (
        <NavLink
          key={svc.getName().toRaw() + "-entities-none"}
          label={"No entities"}
        ></NavLink>
      )}

      {/* Service - Methods */}
      <NavLink
        key={svc.getName().toRaw() + "-methods"}
        href={svc.getName().toRaw() + "-methods"}
        label={"Methods"}
      >
        {(methods.length > 0 &&
          methods.map((mth) => {
            return (
              <NavLink
                key={mth.namespace.toString()}
                href={`/${mth.namespace.service?.toRaw()}/method/${mth.namespace.method?.toRaw()}`}
                label={mth.namespace.toLabel()}
              />
            );
          })) || (
          <NavLink
            key={svc.getName().toRaw() + "-methods-none"}
            label={"No methods"}
          >
            {" "}
          </NavLink>
        )}
      </NavLink>
    </NavLink>
  );
};
