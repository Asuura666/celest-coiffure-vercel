import { ContactForm } from "@/components/contact-form";
import { TrackedLink } from "@/components/tracked-link";
import { getSiteData } from "@/lib/sanity";

export default async function Home() {
  const site = await getSiteData();
  const telHref = `tel:${site.phone.replace(/\s/g, "")}`;

  return (
    <>
      <header className="nav-wrap">
        <nav className="nav container" aria-label="Navigation principale">
          <a className="brand" href="#top" aria-label="Celest accueil">
            CELEST<span>COIFFURE ÉLÉGANCE</span>
          </a>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#salon">Le salon</a>
            <a href="#contact">Contact</a>
          </div>
          <TrackedLink
            href={site.planityUrl}
            eventName="PlanityClick"
            location="navigation"
            className="button button-small"
            target="_blank"
          >
            Réserver
          </TrackedLink>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{site.heroEyebrow}</p>
              <h1>{site.heroTitle}</h1>
              <p className="hero-text">{site.heroText}</p>
              <div className="actions">
                <TrackedLink
                  href={site.planityUrl}
                  eventName="PlanityClick"
                  location="hero"
                  className="button button-dark"
                  target="_blank"
                >
                  Prendre rendez-vous
                </TrackedLink>
                <TrackedLink
                  href={telHref}
                  eventName="PhoneClick"
                  location="hero"
                  className="text-link"
                >
                  {site.phone}
                </TrackedLink>
              </div>
            </div>
            <div className="hero-card" aria-label="Ambiance Celest">
              <span className="hero-number">01</span>
              <div>
                <p>Salon mixte</p>
                <strong>Coupe · couleur · soin</strong>
              </div>
              <div>
                <p>Adresse</p>
                <strong>{site.address}</strong>
              </div>
            </div>
          </div>
        </section>

        {site.promotionEnabled && (
          <section className="promo-strip">
            <div className="container promo-inner">
              <strong>{site.promotionTitle}</strong>
              <span>{site.promotionText}</span>
              <TrackedLink
                href={site.planityUrl}
                eventName="PlanityClick"
                location="promotion"
                className="promo-link"
                target="_blank"
              >
                Voir les disponibilités →
              </TrackedLink>
            </div>
          </section>
        )}

        <section className="section container" id="services">
          <div className="section-heading">
            <p className="eyebrow">Nos essentiels</p>
            <h2>Des prestations pensées autour de vous.</h2>
          </div>
          <div className="services-grid">
            {site.services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <span>0{index + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section salon-section" id="salon">
          <div className="container salon-grid">
            <div className="salon-image-wrap">
              {/* Image de l'ancien site en attendant sa migration vers Sanity */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={site.aboutImageUrl} alt="Kevin, créateur de Celest Coiffure" />
            </div>
            <div className="salon-copy">
              <p className="eyebrow">Celest</p>
              <h2>{site.aboutTitle}</h2>
              <p>{site.aboutText}</p>
              <blockquote>
                “Le bon résultat commence toujours par l’écoute et le conseil.”
              </blockquote>
              <TrackedLink
                href={site.instagramUrl}
                eventName="InstagramClick"
                location="about"
                className="text-link"
                target="_blank"
              >
                Découvrir les réalisations sur Instagram →
              </TrackedLink>
            </div>
          </div>
        </section>

        <section className="section container contact-section" id="contact">
          <div className="contact-copy">
            <p className="eyebrow">Une question ?</p>
            <h2>Parlons de vos cheveux.</h2>
            <p>
              Pour réserver, Planity reste le moyen le plus rapide. Pour une
              question ou un projet de changement, envoyez directement un message
              au salon.
            </p>
            <div className="contact-details">
              <TrackedLink
                href={telHref}
                eventName="PhoneClick"
                location="contact"
                className="contact-detail"
              >
                <span>Téléphone</span>
                <strong>{site.phone}</strong>
              </TrackedLink>
              <a className="contact-detail" href={`mailto:${site.email}`}>
                <span>E-mail</span>
                <strong>{site.email}</strong>
              </a>
              <div className="contact-detail">
                <span>Salon</span>
                <strong>{site.address}</strong>
              </div>
            </div>
          </div>
          <ContactForm />
        </section>

        <section className="booking-cta">
          <div className="container booking-inner">
            <p className="eyebrow">Votre prochain rendez-vous</p>
            <h2>Prêt·e pour votre prochaine coupe ?</h2>
            <TrackedLink
              href={site.planityUrl}
              eventName="PlanityClick"
              location="footer-cta"
              className="button button-light"
              target="_blank"
            >
              Réserver sur Planity
            </TrackedLink>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="brand">
            CELEST<span>COIFFURE ÉLÉGANCE</span>
          </div>
          <p>{site.address}</p>
          <div className="footer-links">
            <a href="/mentions-legales">Mentions légales</a>
            <a href="#top">Retour en haut ↑</a>
          </div>
        </div>
      </footer>
    </>
  );
}
