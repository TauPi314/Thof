
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
      <h2>Privacy Policy</h2>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h3>1. Introduction</h3>
      <p>
        Welcome to Thof ("we", "our", or "us"). We respect your privacy and are committed to protecting 
        your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard 
        your information when you use our application integrated with the Pi Network.
      </p>

      <h3>2. Information We Collect</h3>
      <p>We collect the following types of information:</p>
      <ul>
        <li>
          <strong>Pi Network User Information:</strong> When you authenticate with Pi Network, we receive your 
          Pi username and unique identifier as provided by the Pi Network.
        </li>
        <li>
          <strong>Content Information:</strong> Information about the content you upload, create, or interact 
          with on our platform, including videos, projects, and votes.
        </li>
        <li>
          <strong>Payment Information:</strong> When you make or receive payments through Pi Network, we process 
          transaction identifiers and amounts, but we do not store your Pi private keys or sensitive payment details.
        </li>
        <li>
          <strong>Usage Information:</strong> Information about how you use our application, including features 
          accessed, time spent, and interactions with content.
        </li>
      </ul>
      
      <h3>3. Identity Verification</h3>
      <p>
        <strong>No Additional Identity Information Required:</strong> Since Pi Network already verifies user identities 
        through their KYC (Know Your Customer) process, Thof does not request or collect any additional identity 
        verification information from you. We rely on Pi Network's existing KYC system for user verification.
      </p>

      <h3>4. How We Use Your Information</h3>
      <p>We use your information for the following purposes:</p>
      <ul>
        <li>To provide, maintain, and improve our services</li>
        <li>To process transactions and manage your account</li>
        <li>To personalize your experience and deliver content relevant to your interests</li>
        <li>To communicate with you about updates, features, or support</li>
        <li>To ensure compliance with Pi Network rules and our terms of service</li>
        <li>To detect, prevent, and address technical issues or fraudulent activities</li>
      </ul>

      <h3>5. Sharing Your Information</h3>
      <p>
        We may share your information in the following circumstances:
      </p>
      <ul>
        <li>With Pi Network as required for authentication and transaction processing</li>
        <li>With other users when you choose to make your content or profile public</li>
        <li>With service providers who perform services on our behalf</li>
        <li>To comply with legal obligations or protect rights</li>
        <li>With your consent or at your direction</li>
      </ul>
      <p>
        We do not sell your personal information to third parties.
      </p>

      <h3>6. Data Security</h3>
      <p>
        We implement appropriate technical and organizational measures to protect your personal information.
        However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
      </p>

      <h3>7. Your Rights</h3>
      <p>
        Depending on your location, you may have certain rights regarding your personal information, including:
      </p>
      <ul>
        <li>The right to access your personal information</li>
        <li>The right to correct inaccurate information</li>
        <li>The right to delete your personal information</li>
        <li>The right to restrict or object to processing</li>
        <li>The right to data portability</li>
      </ul>
      <p>
        To exercise these rights, please contact us using the information provided below.
      </p>

      <h3>8. Children's Privacy</h3>
      <p>
        Our services are not intended for individuals under the age of 16. We do not knowingly collect personal 
        information from children under 16. If we learn we have collected personal information from a child under 16, 
        we will delete this information.
      </p>

      <h3>9. Changes to This Privacy Policy</h3>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
        Privacy Policy on this page and updating the "Last updated" date.
      </p>

      <h3>10. Contact Us</h3>
      <p>
        If you have any questions about this Privacy Policy or our practices, please contact us at: 
        privacy@thof.app
      </p>

      <h3>11. Pi Network Compliance</h3>
      <p>
        This application adheres to all Pi Network developer policies and guidelines. Any personal information 
        shared with Pi Network is subject to Pi Network's own Privacy Policy as well.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
