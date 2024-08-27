"use client";
import { AppHeader } from "@/components";
import Image from "next/image";
import { useRouter } from "next/navigation";

function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="container scroller privacy-container">
      <div className="dex-only privacy-header-dex">
        <div
          className="back-button"
          onClick={() => router.back()}
          style={{ marginBottom: "0px" }}
        >
          <Image
            className=""
            src="/icons/back.svg"
            alt="captured Image"
            width={16}
            height={16}
            loading="lazy"
          />
          Back
        </div>
        <h2>Privacy Policy</h2>
        <div>
          <Image
            className=""
            src="/icons/speaker.svg"
            alt="captured Image"
            width={24}
            height={24}
            loading="lazy"
          />
        </div>
      </div>
      <div className="items-wrap">
        <AppHeader title="Privacy Policy" />
        <div className="privacy-policy-content">
          <br />
          <h4 className="set-text">Cookie User Notice</h4>
          <p className="privacy-text">
            On a limited basis, RecoveryTrek employs “cookies” to provide better
            service to our customers. We do not use cookies to collect any
            personally-identifying information from users or to track user
            activities beyond our web site. We do not maintain copies of cookies
            on our web site after you leave our web site.
          </p>
          <p className="privacy-text">
            Cookies are small pieces of temporary data that are exchanged
            between a web site and a user’s computer which enable a “session”,
            or “dialog”, to be established between the two machines. With the
            session established, RecoveryTrek is able to tailor its responses
            (i.e., provide you with the information you want) and help you
            traverse our web pages in the most efficient and effective manner
            possible.
          </p>

          <h4 className="set-text">Security Procedure</h4>
          <p className="privacy-text">
            For security purposes, our website employs software programs to
            monitor network traffic to identify unauthorized attempts to upload
            or change information, or otherwise cause damage. We protect the
            security of your information during transmission by using Secure
            Sockets Layer (SSL), which encrypts information you input. The SSL
            cipher is indicated by the “https” prefix in the uniform resource
            locator (URL) address. At any time, you can double-click the padlock
            icon or key icon (for Internet Explorer or Netscape, respectively)
            in the bottom corner of the browser window to view the details of
            our SSL certificate.
          </p>
          <p className="privacy-text">
            Encryption is based on a key that has two different parts: the
            public part and the private part. The public part of the key is
            distributed to those you want to communicate with. The private part
            is for the recipient’s use only. When you send personal information
            to RecoveryTrek.com, you use RecoveryTrek’s public key to encrypt
            your personal information. That means, if at any point during the
            transmission your information is intercepted, it is scrambled and
            very difficult to decrypt. Once RecoveryTrek receives your encrypted
            personal information, we use the private part of our key to decode
            it.
          </p>
          <p className="privacy-text">
            Our cloud-based Success Management Software and web site are hosted
            in a secure server environment that uses advanced firewall and other
            cutting edge technology to prevent interference or access from
            intruders. Your information and data is safe, secure, and available
            only to registered and authorized users.
          </p>

          <h4 className="set-text">Emails from Recovery Trek</h4>
          <p className="privacy-text">
            Never respond to emails claiming that an I.T. or I.S. administrator
            needs your username and password. These are phishing schemes. For
            future reference, the following are valid RecoveryTrek email
            accounts and are the only ones authorized to send out emails to
            participants or company-wide distribution lists or to send emails
            advising individual users about some aspect of RecoveryTrek
            technology:
          </p>
          <ul className="privacy-list">
            <li>GreatSupport@RecoveryTrek.com</li>
            <li>Finance@RecoveryTrek.com</li>
            <li>Billing@RecoveryTrek.com</li>
            <li>TechSupport@RecoveryTrek.com</li>
          </ul>
          <p className="privacy-text">
            ​You can ignore and delete any messages pertaining to technology
            services NOT from one of the addresses listed above. As a reminder,
            members of our technology department WILL NEVER ask you for your
            password FOR ANY REASON. NEVER disclose your password to ANY third
            party. NEVER click on any links in these emails.
          </p>

          <h4 className="set-text">HIPAA</h4>
          <p className="privacy-text">
            The Health Insurance Portability and Accountability Act (HIPAA)
          </p>
          <p className="privacy-text">
            RecoveryTrek LLC uses many security features to ensure that only
            authorized users access “protected health information (PHI).” The
            following measures are set forth for compliance of HIPAA regulations
            for Privacy and Security.
          </p>
          <p className="privacy-text">
            The Privacy Rule protects all PHI, or “individually identifiable
            health information” held or transmitted by RecoveryTrek.
            Individually identifiable health information includes many common
            identifiers (e.g., name, address, birth date, Social Security
            Number, credit card data), as well as the provision of health care
            to an individual (physical or mental).
          </p>

          <h4 className="set-text">How We Collect Information About You?</h4>
          <p className="privacy-text">
            Only authorized RecoveryTrek employees may collect data (through a
            variety of means including but not necessarily limited to letters,
            phone calls, emails, voice mails, and from the submission of
            enrollment applications) that is either required by law, or
            necessary to serve participants and clients. The CEO is responsible
            for developing and implementing privacy compliance and is the person
            to receive complaints and provide additional information.
          </p>

          <h4 className="set-text">How We Handle Your Information?</h4>
          <p className="privacy-text">
            Information about your financial situation and medical conditions
            that we receive from other providers or that you provide to us in
            writing, via email, on the phone (including information left on
            voice mails), contained in or attached to correspondence, or
            directly or indirectly given to us, is held in strictest confidence.
          </p>
          <p className="privacy-text">
            We do not give out, exchange, barter, rent, sell, lend, or
            disseminate any information about participants or clients who
            receive our services that is considered patient confidential, is
            restricted by law, or has been specifically restricted by a
            patient/client.
          </p>
          <p className="privacy-text">
            Information is only used as is reasonably necessary to process your
            enrollment or to provide you or your case manager with health or
            counseling services. We use, disclose, and request only the minimum
            amount of protected health information needed to accomplish this. We
            do not use cookies on our website to collect unique, personal data.
          </p>
          <p className="privacy-text">
            RecoveryTrek uses administrative, technical, and physical safeguards
            to prevent intentional or unintentional use or disclosure of
            protected health information in violation of the Privacy Rule. For
            example, this includes shredding documents containing protected
            health information before discarding them, securing medical records
            with lock and key or pass code, and limiting access to keys or pass
            codes.
          </p>

          <h4 className="set-text">Workforce Training</h4>
          <p className="privacy-text">
            RecoveryTrek uses administrative, technical, and physical safeguards
            to prevent intentional or unintentional use or disclosure of
            protected health information in violation of the Privacy Rule. For
            example, this includes shredding documents containing protected
            health information before discarding them, securing medical records
            with lock and key or pass code, and limiting access to keys or pass
            codes.
          </p>

          <h4 className="set-text">
            Limited Right to Use Non-Identifying Personal Information
          </h4>
          <p className="privacy-text">
            Any pictures, correspondence, or thank you notes sent to us become
            the exclusive property of RecoveryTrek. We reserve the right to use
            non-identifying information for fundraising and promotional
            purposes. No identifying information (names or uniquely identifiable
            data) will be used without client’s express advance permission.
          </p>
          <p className="privacy-text">
            The Security Rule specifies our administrative, physical, and
            technical safeguards for the confidentiality, integrity, and
            availability of electronic protected health information (e-PHI).
          </p>
          <p className="privacy-text">
            HIPAA Security Risk Assessment regulations concerning Network
            Security Standards are effective April 21, 2005. Compliance ensures
            that only those who should have access to e-PHI actually have
            access.
          </p>

          <h4 className="set-text">ReecoveryTrek:</h4>
          <div>
            <p className="privacy-text">
              1. Ensures the confidentiality, integrity, and availability of all
              e-PHI we create, receive, maintain or transmit;
            </p>
            <p className="privacy-text">
              2. Identifies and protects against reasonably anticipated threats
              to the security or integrity of the information;
            </p>
            <p className="privacy-text">
              3. Protects against reasonably anticipated, impermissible uses or
              disclosures; and
            </p>
            <p className="privacy-text">
              4. Ensures compliance by our workforce
            </p>
          </div>
          <p className="privacy-text">
            The Security Standards are divided into three Safeguard categories
            including Administrative, Physical, and Technical. Administrative
            Safeguards deal primarily with the personnel and planning functions
            necessary for a Covered HealthCare Provider to comply. The majority
            of the Physical and Technical Safeguards are a function of a
            system’s network infrastructure, hardware capability, and our
            Software Application. The following list of risk factors represent
            the primary Security Implementation Specifications:
          </p>

          <h4 className="set-text">
            1. Does the RecoveryTrek system permit data encryption/decryption?
          </h4>
          <p className="privacy-text">
            Yes, any wide area network which is Internet based is fully
            encrypted with local connection optionally encrypted.
          </p>

          <h4 className="set-text">
            2. Does each user have a unique user identification code?
          </h4>
          <p className="privacy-text">Yes.</p>

          <h4 className="set-text">
            3. Does each user have a unique user password?
          </h4>
          <p className="privacy-text">
            Yes. The system requires the user to enter his/her password at
            login. Furthermore, the system can require users to change their
            passwords a set number of days.
          </p>

          <h4 className="set-text">
            4. Are there integrity controls for transmission?
          </h4>
          <p className="privacy-text">Yes.</p>

          <h4 className="set-text">
            5. Are users automatically logged off after a period of inactivity?
          </h4>
          <p className="privacy-text">
            Yes, In compliance with the client’s security policy, this will be
            set up to log Users off after a pre-determined time of inactivity.
          </p>

          <h4 className="set-text">
            6. Is the data protected from unauthorized, unanticipated or
            unintentional alteration, including detection of such activities?
          </h4>
          <p className="privacy-text">Yes.</p>

          <h4 className="set-text">
            7. Are there mechanisms to record and examine user activity?
          </h4>
          <p className="privacy-text">
            Yes, RecoveryTrek tracks user activity in critical areas of software
            use. RecoveryTrek can also track a record of screens accessed
            without data change. This added functionality is available as an
            add-on module.
          </p>

          <h4 className="set-text">
            8. Are there procedures for accessing the application during an
            emergency?
          </h4>
          <p className="privacy-text">Yes.</p>

          <h4 className="set-text">
            Server, Network, and Application level Security
          </h4>
          <p className="privacy-text">
            The most basic type of security is physical security of the server
            and backup media. Access and times are restricted to only authorized
            users (role-based access). In addition, the server is accessed only
            from authorized locations, and the data is protected while it is in
            transit. Router configurations, access lists, and other similar
            tools are used to ensure that only users in authorized locations are
            able to gain access.
          </p>
          <p className="privacy-text">
            We also encrypt data in transit between the user session and the
            server. In such cases, RecoveryTrek uses Secure Socket Layer (SSL)
            encryption, a standard Internet encryption, or Virtual Private
            Networking (VPN).
          </p>
          <p className="privacy-text">
            Our cloud-based web site is hosted in Salesforce.com’s secure server
            environment that uses a firewall and other advanced technology to
            prevent interference or access from intruders. RecoveryTrek and
            Salesforce.com utilize the most advanced technology for Internet
            security. In a HIPAA compliant fashion, your information and data is
            safe, secure, and available only to registered and authorized users.
          </p>
          <p className="privacy-text">
            RecoveryTrek complies with all government regulations for data
            transmission and storage, including the HIPAA Electronic Transaction
            and Code Sets Rule. Our CEO is the Security Official responsible for
            developing and implementing security policies and procedures, to
            include annual assessment of how well these meet requirements of the
            Security Rule.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
