import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="policy-outlet">
      <div className="policy-outlet-content">
        <h3>Privacy Policy</h3>
        <p>
          Welcome to WatchFlex. We are committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you visit{" "}
          <Link style={{ color: "white" }} to={"/"}>
            {" "}
            our website
          </Link>
          , including any other media form, media channel, mobile website, or
          mobile application related or connected thereto (collectively, the
          "Site"). Please read this privacy policy carefully. If you do not
          agree with the terms of this privacy policy, please do not access the
          site.
        </p>
        <br />
        <h4>1. Collection of Your Information</h4>
        <p>
          We may collect information about you in a variety of ways. The
          information we may collect on the Site includes: <br />
          <span className="policy-subheading">Personal Data:</span> Personally
          identifiable information, such as your name, shipping address, email
          address, and telephone number, that you voluntarily give to us when
          you register with the Site or when you choose to participate in
          various activities related to the Site.
          <br />
          <span className="policy-subheading">Derivative Data:</span>{" "}
          Information our servers automatically collect when you access the
          Site, such as your IP address, browser type, operating system, access
          times, and the pages you have viewed directly before and after
          accessing the Site.
          <br />
          <span className="policy-subheading">Financial Data:</span> Financial
          information, such as data related to your payment method (e.g., valid
          credit card number, card brand, expiration date), that we may collect
          when you purchase, order, return, exchange, or request information
          about our services from the Site. [Only include this if your site
          processes financial transactions] <br />
          <span className="policy-subheading">
            Data from Social Networks:
          </span>{" "}
          User information from social networking sites, such as Facebook,
          Twitter, Instagram, etc., including your name, your social network
          username, location, gender, birth date, email address, profile
          picture, and public data for contacts, if you connect your account to
          such social networks.
        </p>
        <h4>2. Use of Your Information</h4>
        <p>
          Having accurate information about you permits us to provide you with a
          smooth, efficient, and customized experience. Specifically, we may use
          information collected about you via the Site to: Create and manage
          your account. Email you regarding your account or order. Fulfill and
          manage purchases, orders, payments, and other transactions related to
          the Site. Increase the efficiency and operation of the Site. Monitor
          and analyze usage and trends to improve your experience with the Site.
          Notify you of updates to the Site. Offer new products, services,
          and/or recommendations to you. Perform other business activities as
          needed. Prevent fraudulent transactions, monitor against theft, and
          protect against criminal activity. Resolve disputes and troubleshoot
          problems. Respond to product and customer service requests.
        </p>
        <h4>3. Disclosure of Your Information</h4>
        <p>
          We may share information we have collected about you in certain
          situations. Your information may be disclosed as follows: <br />
          By Law or to Protect Rights: If we believe the release of information
          about you is necessary to respond to legal process, to investigate or
          remedy potential violations of our policies, or to protect the rights,
          property, and safety of others, we may share your information as
          permitted or required by any applicable law, rule, or regulation.
          Third-Party Service Providers: We may share your information with
          third parties that perform services for us or on our behalf, including
          payment processing, data analysis, email delivery, hosting services,
          customer service, and marketing assistance. Marketing Communications:
          With your consent, or with an opportunity for you to withdraw consent,
          we may share your information with third parties for marketing
          purposes, as permitted by law. Interactions with Other Users: If you
          interact with other users of the Site, those users may see your name,
          profile photo, and descriptions of your activity. Online Postings:
          When you post comments, contributions, or other content to the Site,
          your posts may be viewed by all users and may be publicly distributed
          outside the Site.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
