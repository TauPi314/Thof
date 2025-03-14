
import React from 'react';

const TermsOfService = () => {
  return (
    <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
      <h2>Terms of Service</h2>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h3>1. Acceptance of Terms</h3>
      <p>
        By accessing or using Thof ("the Application"), you agree to be bound by these Terms of Service 
        and all applicable laws and regulations. If you do not agree with any of these terms, you are 
        prohibited from using the Application.
      </p>

      <h3>2. Pi Network Integration</h3>
      <p>
        The Application integrates with the Pi Network ecosystem. By using the Application, you acknowledge that:
      </p>
      <ul>
        <li>You must have a valid Pi Network account to access certain features</li>
        <li>All Pi transactions are subject to Pi Network's policies and blockchain confirmation</li>
        <li>We are not responsible for any issues with the Pi Network or Pi cryptocurrency</li>
        <li>You must comply with Pi Network's Terms of Service in addition to ours</li>
      </ul>

      <h3>3. User Accounts and Identity Verification</h3>
      <p>
        When you create an account with us through Pi Network authentication:
      </p>
      <ul>
        <li>We rely on Pi Network's KYC (Know Your Customer) process for identity verification and do not collect additional identity information</li>
        <li>You are responsible for maintaining the confidentiality of your account information</li>
        <li>You are responsible for all activities that occur under your account</li>
        <li>You must notify us immediately of any unauthorized use of your account</li>
      </ul>
      
      <h3>4. User-Generated Content</h3>
      <p>
        The Application allows users to upload, post, and share content. You retain ownership of 
        your content, but by uploading, you grant us a worldwide, non-exclusive, royalty-free license 
        to use, reproduce, modify, and display your content for the purpose of operating and improving 
        the Application.
      </p>
      <p>
        You must not upload content that:
      </p>
      <ul>
        <li>Infringes on intellectual property rights</li>
        <li>Contains illegal, harmful, threatening, abusive, or hateful material</li>
        <li>Contains malware or destructive code</li>
        <li>Violates any applicable laws or regulations</li>
      </ul>
      <p>
        We reserve the right to remove any content at our discretion.
      </p>

      <h3>5. Payments and Transactions</h3>
      <p>
        All payments and transactions within the Application are processed using Pi cryptocurrency 
        through the Pi Network platform. By making or accepting payments:
      </p>
      <ul>
        <li>You acknowledge that transactions are final and cannot be reversed once confirmed on the blockchain</li>
        <li>You agree to pay all applicable fees associated with transactions</li>
        <li>You understand that the value of Pi cryptocurrency may fluctuate</li>
        <li>You are responsible for any tax implications related to your transactions</li>
      </ul>

      <h3>6. Intellectual Property</h3>
      <p>
        The Application and its original content, features, and functionality are owned by us and are 
        protected by international copyright, trademark, patent, trade secret, and other intellectual 
        property laws.
      </p>

      <h3>7. Limitation of Liability</h3>
      <p>
        To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, 
        special, consequential, or punitive damages resulting from your access to or use of, or inability 
        to access or use, the Application or any content therein.
      </p>

      <h3>8. Termination</h3>
      <p>
        We may terminate or suspend your account and access to the Application immediately, without 
        prior notice or liability, for any reason, including without limitation if you breach the Terms.
      </p>

      <h3>9. Changes to Terms</h3>
      <p>
        We reserve the right to modify or replace these Terms at any time. We will provide notice of any 
        material changes through the Application or via email.
      </p>

      <h3>10. Governing Law</h3>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in 
        which the Application is based, without regard to its conflict of law provisions.
      </p>

      <h3>11. Contact</h3>
      <p>
        If you have any questions about these Terms, please contact us at: terms@thof.app
      </p>
    </div>
  );
};

export default TermsOfService;
