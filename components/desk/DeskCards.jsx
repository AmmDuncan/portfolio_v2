import { books } from "../../data/books";
import { sideProjects, thumbSrc } from "../../data/projects";
import { BLOG_URL, EMAIL, GITHUB_URL } from "../../data/site";
import { CARD_COPY, MODEL_CREDIT } from "./deskContent";
import { Card, CtaRow } from "./Card.styles";
import { Section } from "./DeskJourney.styles";

const guide = books[0];
const external = { target: "_blank", rel: "noopener noreferrer" };
const { guides: GUIDES, side: SIDE, contact: CONTACT } = CARD_COPY;

/** The text cards beside the desk objects: the guide, side projects and contact. */
export function DeskCards({ sectionRefs, cardRefs, heightRef }) {
  return (
    <>
      <Section ref={sectionRefs.guides} id="guides" $vh={220}>
        <Card ref={cardRefs.guides}>
          <div className="panel">
            <span className="label">{GUIDES.label}</span>
            <h2>{guide.title}</h2>
            <p>{guide.description}</p>
            {guide.price && <p className="note price">{guide.price}</p>}
            <CtaRow>
              <a className="primary" href={guide.link} {...external}>
                {GUIDES.primary}
              </a>
              <a className="secondary" href={guide.blogLink} {...external}>
                {GUIDES.secondary}
              </a>
            </CtaRow>
          </div>
        </Card>
      </Section>

      <Section ref={sectionRefs.side} id="side" $vh={170}>
        <Card ref={cardRefs.side}>
          <div className="panel">
            <span className="label">{SIDE.label}</span>
            <h2>{SIDE.title}</h2>
            <p>{SIDE.intro}</p>
            <ul>
              {sideProjects.map((p) => (
                <li key={p.name}>
                  <a href={p.link} {...external}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="thumb" src={thumbSrc(p.imgSrc)} alt="" width={60} height={38} loading="lazy" />
                    <span className="name">
                      {p.name}
                      <small>{p.summary ?? p.description}</small>
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </Section>

      <Section ref={sectionRefs.contact} id="contact" $vh={300}>
        <Card ref={cardRefs.contact}>
          <div className="panel">
            <span className="label">{CONTACT.label}</span>
            <h2>{CONTACT.title}</h2>
            <p>{CONTACT.intro}</p>
            <CtaRow>
              <a className="primary" href={`mailto:${EMAIL}`}>
                {CONTACT.email}
              </a>
              <a className="secondary" href={GITHUB_URL} {...external}>
                {CONTACT.github}
              </a>
              <a className="secondary" href={BLOG_URL} {...external}>
                {CONTACT.blog}
              </a>
            </CtaRow>
            <p className="note" ref={heightRef} aria-hidden="true">
              Desk height 74 cm
            </p>
            <p className="credit">
              {MODEL_CREDIT.lead}{" "}
              <a href={MODEL_CREDIT.source} {...external}>
                {MODEL_CREDIT.title}
              </a>{" "}
              by {MODEL_CREDIT.author},{" "}
              <a href={MODEL_CREDIT.license} {...external}>
                {MODEL_CREDIT.licenseName}
              </a>
              , {MODEL_CREDIT.note}.
            </p>
          </div>
        </Card>
      </Section>
    </>
  );
}
