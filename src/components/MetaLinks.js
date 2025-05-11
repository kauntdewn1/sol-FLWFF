import React from "react";
import { useRouter } from "next/router";
import config from "../config";
import { languages } from "../i18n/config";

const cleanPath = (path) => {
  return path.split("#")[0].split("?")[0];
};

const MetaLinks = () => {
  const router = useRouter();
  const { asPath } = router;
  const asPathNoRedirect = asPath.replace(/\/$/, "");
  const cleanedAsPathNoRedirect = cleanPath(asPathNoRedirect);

  return (
    <>
      <link rel="icon" href="/favicon.png" type="image/png" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link
        rel="canonical"
        href={`${config.siteUrl}${cleanedAsPathNoRedirect}`}
      />
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${config.siteUrl}${cleanedAsPathNoRedirect}`}
      />
      {Object.keys(languages).map((language, k) => (
        <link
          key={k}
          rel="alternate"
          hrefLang={language}
          href={`${config.siteUrl}${
            language === "en" ? "" : "/" + language
          }${cleanedAsPathNoRedirect}`}
        />
      ))}
    </>
  );
};

export default MetaLinks;
