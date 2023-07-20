import * as React from "react";
import { graphql } from "gatsby";
import { ExperienceMapper } from "@ninetailed/experience.js-utils";
import { Experience, Personalize } from "@ninetailed/experience.js-gatsby";
import Hero from "../components/Hero";

export default function Page(props: any) {
  const { contentfulComposePage } = props.data;
  const { content } = contentfulComposePage;

  function mapExperiences(experiences: any) {
    return (experiences || [])
      .filter(ExperienceMapper.isExperienceEntry)
      .map(ExperienceMapper.mapExperience);
  }

  return (
    <div>
      <div style={{ fontSize: "1.5em" }}>
        <pre>You've visited the {contentfulComposePage.slug} page!</pre>
        <pre>
          There are {contentfulComposePage.sections.length} sections on this entry,{" "}
          {contentfulComposePage.sections.filter(
            (section: any) => section.sys?.contentType.sys.id === "hero"
          ).length || "none"}{" "}
          of which is a Hero section.
        </pre>
      </div>
      {contentfulComposePage.sections.map((section: any) => {
        if (section.sys?.contentType.sys.id === "hero") {
          console.log(section.nt_experiences);
          const mappedExperiences = mapExperiences(section.nt_experiences);
          console.log(mappedExperiences);
          return (
            <Experience
              {...section}
              id={section.id}
              key={section.id}
              experiences={mappedExperiences}
              component={Hero}
            />
          );
        }
      })}
    </div>
  );
}

export const query = graphql`
  query ComposePageContent($slug: String!) {
    contentfulComposePage(slug: { eq: $slug }) {
      name
      title
      slug
      sections {
        ... on ContentfulHero {
          ...ContentfulHeroContent
          nt_experiences {
            ...ExperienceContent
          }
        }
      }
    }
  }
`;
