import React from "react";
import url from "url";
import config from "../../../config";
import ArticleMeta from "./ArticleMeta";
import WebsiteMeta from "./WebsiteMeta";
import { useRouter } from "next/router";

/**
 * MetaData will generate all relevant meta data information incl.
 * JSON-LD (schema.org), Open Graph (Facebook) and Twitter properties.
 *
 */
const MetaData = ({ data = {}, settings = {} }) => {
  const canonical = url.resolve(
    config.siteUrl,
    asPath.split("#")[0]
  );
  const { builderPost, builderTag } = data;

  if (builderPost) {
    return (
      <ArticleMeta
        data={builderPost}
        canonical={canonical}
        settings={settings}
      />
    );
  } else if (builderTag) {
    return (
      <WebsiteMeta
        data={builderTag}
        canonical={canonical}
        type="Series"
        settings={settings}
      />
    );
  } else {
    const title = config?.siteMetadata.title || settings?.title;
    const description =
      config?.siteMetadata.description || settings?.description;
    let image = settings?.logo || settings?.cover_image || null;
    image = image ? url.resolve(config?.siteUrl, image) : null;

    return (
      <WebsiteMeta
        data={{}}
        canonical={canonical}
        title={title}
        description={description}
        image={image}
        type="WebSite"
        settings={settings}
      />
    );
  }
};

const MetaDataQuery = ({ settings, ...rest }) => (
  <MetaData settings={settings} {...rest} />
);

export default MetaDataQuery;
