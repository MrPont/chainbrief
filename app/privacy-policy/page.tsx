import PageHero from "../../components/PageHero";

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="This placeholder explains how ChainBrief may handle visitor data, analytics, advertising information, and communication requests."
      />
      <section className="text-panel">
        <p>
          A full privacy policy should be reviewed by legal counsel before the
          website goes live. Future sections may cover cookies, analytics tools,
          newsletter subscriptions, user rights, and data retention.
        </p>
      </section>
    </>
  );
}
