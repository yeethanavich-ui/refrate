export default function TermsPage() {
  return (
    <div className="prose prose-invert max-w-none space-y-6 text-steel-300">
      <h1 className="font-display text-3xl text-steel-100">
        Terms of Use
      </h1>

      <p>
        Ref Reviews is a community platform where fencers, coaches, and
        parents can share their experiences with referees they have
        encountered at tournaments. By using this site, you agree to the
        following:
      </p>

      <h2 className="font-display text-xl text-steel-100">
        Reviews are opinions, not verified facts
      </h2>
      <p>
        Reviews reflect the personal opinions and experiences of the
        individual who wrote them. They are not verified, endorsed, or
        fact-checked by Ref Reviews, and do not represent the views of USA
        Fencing or any tournament organizer.
      </p>

      <h2 className="font-display text-xl text-steel-100">
        Community guidelines
      </h2>
      <p>Reviews should:</p>
      <ul>
        <li>Be based on a specific, real event you personally attended</li>
        <li>Focus on the referee's officiating (rule knowledge, fairness, pace, communication)</li>
        <li>Avoid personal attacks, slurs, or unrelated commentary</li>
      </ul>
      <p>
        All reviews are held for moderation before appearing publicly.
        Reviews that violate these guidelines will not be approved, or will
        be removed if found after publishing.
      </p>

      <h2 className="font-display text-xl text-steel-100">
        Are you a referee with a concern about your listing?
      </h2>
      <p>
        If you believe a review about you is false, abusive, or violates
        these guidelines, or if you'd like your listing corrected or
        removed, please contact us at{" "}
        <a href="mailto:refreviewshelp@gmail.com" className="text-touche hover:underline">
          refreviewshelp@gmail.com
        </a>
        . We review every report.
      </p>

      <h2 className="font-display text-xl text-steel-100">
        Accounts
      </h2>
      <p>
        Leaving a review requires an account and a USA Fencing membership
        number. This is used to help prevent spam and repeated abuse — it is
        not independently verified against USA Fencing's own records.
      </p>

      <p className="text-sm text-steel-400">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
