import { builder, BuilderComponent, useIsPreviewing } from "@builder.io/react";
import HTMLHead from "@/components/builder/HTMLHead";
import NotFoundPage from "./404";
import customComponentsRegistration from "@/utils/customComponentGenerator";
import Layout from "@/components/layout";
import { PAGE_BUILDER_CONFIG } from "@/lib/builder/page/constants";
import { getPage, getAllPagesWithSlug } from "@/lib/builder/page/api";
import ModalLauncher from "@/components/ModalLauncher/ModalLauncher";

builder.apiVersion = "v3";
customComponentsRegistration();

const Page = ({ page, builderLocale }) => {
  const isPreviewing = useIsPreviewing();

  if (useAppRouterNavigation(page)) {
    window.location.reload();
    return null;
  }

  if (!page && !isPreviewing) {
    return <NotFoundPage />;
  }

  return (
    <>
      <HTMLHead
        seo={page?.data?.seo}
        openGraph={page?.data?.openGraph}
        twitterMeta={page?.data?.openGraph}
      />
      <Layout>
        <BuilderComponent
          model={PAGE_BUILDER_CONFIG.pagesModel}
          content={page}
          options={{
            includeRefs: true,
            noTraverse: true,
          }}
        />
        <ModalLauncher />
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  const allPages = await getAllPagesWithSlug();
  const paths = [];

  allPages?.forEach((page) => {
    if (page.data.slug) {
      const slugs = page.data.slug.split('/');
      paths.push({
        params: { slug: slugs },
      });
    }
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const page = await getPage(params.slug);
  return {
    props: {
      page,
    },
  };
}

export default Page;

function useAppRouterNavigation(page) {
  // There's a bug in Next.js when navigating from the pages router to the app router, we end up in this catch-all route instead of navigating to the app router page, see: https://github.com/vercel/next.js/issues/74696
  // As a workaround, this function checks if we should navigate to the app router page instead of being here
  const pathname = usePathname();
  if (page) return false;
  const regexes = [
    new RegExp(`^/(?:[^/]{2}/)?docs(/.*)?$`),
    new RegExp(`^/(?:[^/]{2}/)?developers(/)?$`),
    new RegExp(`^/(?:[^/]{2}/)?developers/cookbook(/.*)?$`),
    new RegExp(`^/(?:[^/]{2}/)?developers/courses(/.*)?$`),
    new RegExp(`^/(?:[^/]{2}/)?developers/guides(/.*)?$`),
  ];
}
