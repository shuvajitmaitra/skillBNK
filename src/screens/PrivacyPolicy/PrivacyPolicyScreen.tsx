import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import Markdown from 'react-native-markdown-display';
import CustomFonts from '../../constants/CustomFonts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import SectionHeading from '../../components/PrivacyPolicyCom/SectionHeading';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import {MarkdownStylesProps} from '../../types/markdown/markdown';
import {TColors} from '../../types';
import {theme} from '../../utility/commonFunction';

const PrivacyPolicyScreen = () => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const markdownContent1 = `
  - Chat: This feature likely enables real-time communication among students, teachers, and administrators. It can be useful for discussions, questions, and collaboration.
  - Notification: Notifications help keep users informed about important updates, events, or announcements related to the school or their courses.
  - Slide: Slide functionality might allow for the creation and sharing of presentation slides, which can be used for teaching, assignments, or student presentations.
  - Calendar: A calendar feature helps schedule classes, assignments, exams, and other important dates, ensuring everyone stays organized.
  - Automated Mock Interview: This feature could be valuable for students preparing for job interviews, providing them with practice opportunities and feedback.
  - Interview Review: The platform may offer feedback and evaluation to help students improve their interview skills after conducting mock interviews.
  - Payment: Payment integration could be used for various purposes, such as fee collection, purchasing course materials, or other financial transactions.
  - Presentation: Presentation tools might allow for creating and delivering interactive presentations, enhancing the teaching and learning experience.
  - Document Storage: Storing documents within the platform makes it easy for teachers and students to access course materials, assignments, and resources.
  - Document Share: This feature likely enables users to share documents and collaborate on projects or assignments.
  `;
  const markdownContent2 = `
  1.1 Thank you for visiting our website. The website is operated by TS4U Inc. skillBNK is a Saas based platform (“skillBNK,” “we,” “us,” or “our”), whose registered office is at 30500 Van Dyke Ave, Suite 201 Warren MI 48093.

  1.2. This Privacy Policy governs our use of information collected through our website at www.skillbnk.com and any mobile applications (“Website”), and through our software applications, in email, text, and other electronic messages between us and visitors to this website (“you,” “your”), and as further set forth under Section 5 (“Purposes and Legal Basis for Use of Personal Information”). This Privacy Policy does not apply to Content we process on behalf of customers of our business offerings, such as our services or Platform. Our use of that data is governed by our customer agreements covering access to and use of those offerings. This Privacy Policy does not apply to data that our customers use in their business or how our customers use data they collect through our cloud offerings.

  1.3. This Privacy Policy sets out what personal data we collect and process about you in connection with the services and functions of skillBNK through your use of our website, where we obtain the data from, what we do with that data; how we comply with the data protection rules, who we transfer data to and how we deal with individuals’ rights in relation to their personal data. Links to all of this information may be accessed by clicking on the titles in the table of contents. Any personal data is collected and processed in accordance with EU data protection laws.

  1.4. All our employees and contractors are required to comply with this Privacy Policy when they process personal data on our behalf.

  1.5. Please note that we may disclose individuals’ information to trusted third parties for the purposes set out and explained in this document. We require all third parties to have appropriate technical and operational security measures in place to protect your personal data, in line with EU laws on data protection and other applicable privacy laws.

  We are not responsible for the content or the privacy policies for any websites which we provide external links to.

  We may update this Privacy Policy from time to time. Any changes will be posted, and changes will only apply to activities and information on a going forward, not retroactive, basis. You are encouraged to review the Privacy Policy whenever you visit the site to make sure that you understand how any personal information you provide will be used.
  `;

  const markdownContent3 = `
  If you provide personal information to our website, we shall process this information as a data processor. Unless skillBNK uses some of this information for marketing or business purposes (e.g., metrics), in such case, we shall be considered the data controller under the EU General Data Protection Regulation (EU Regulation 679/2016) (the “GDPR”) and any national laws implementing the GDPR. Additionally, for purposes of the GDPR, skillBNK is the data controller of the personal information we collect through the website. Any questions or concerns regarding our privacy and data protection practices can be directed to us. See the Contact Us section below.
  `;

  const markdownContent4 = `
  3.1. We collect the following types of information:

  3.1.1. Personal Data / Personal Information. We collect information that alone or in combination with other information in our possession could be used to identify you (“Personal Data” or “Personal Information”) as follows:

  (a) Personal Information You Provide: We may collect Personal Information if you create an account to use our website or communicate with us as follows:

  - **Account Information:** When you create an account with us, we will collect information associated with your account, including your name, contact information, account credentials, payment card information, and transaction history (collectively, “Account Information”).
  - **User Content:** When you use our website, we may collect Personal Information that is included in the input, file uploads, or feedback that you provide to our website (“Content”).
  - **Communication Information:** If you communicate with us, we may collect your name, contact information, and the contents of any messages you send (“Communication Information”).
  - **Social Media Information:** We have pages on social media sites like Instagram, Facebook, Medium, Twitter, YouTube and LinkedIn. When you interact with our social media pages, we will collect Personal Information that you elect to provide to us, such as your contact details (collectively, “Social Information”). In addition, the companies that host our social media pages may provide us with aggregate information and analytics about our social media activity.
  - **Product Inquiries:** Information that you provide to us via our website when expressing an interest in obtaining additional information about our service, registering to use our service, or registering for an event, such as name, company name, email address, phone number, and other contact details.
  - **Product/Service Feedback:** Information that you provide to us via survey about our service, product, or customer experience, e.g., AskNicely Surveys.
  - **Job Applications:** Information that you provide to us when applying for a job with our company, such as a resume or cover letter containing other details about your employment history, and information that we may receive from a third party (such as LinkedIn or a recruiter) if you apply for a job with us. This will include your name, contact details, and any information in a resume, such as employment history.

  (b) Personal Information We Receive Automatically When You Interact with Our Website. When you visit, use, and interact with the website, we may receive the following information about your visit, use, or interactions (“Technical Information”):

  - **Location:** Information about your location when you access the website.
  - **Log Data:** Information that your browser automatically sends whenever you use our website (“log data”). Log data includes your Internet Protocol address, browser type and settings, the date and time of your request, and how you interacted with our website.
  - **Usage Data:** We may automatically collect information about your use of the website, such as the types of content that you view or engage with, the features you use, and the actions you take, as well as your search criteria, time zone, country, the dates and times of access, user agent and version, type of computer or mobile device, computer connection, IP address, and the like.
  - **Device Information:** Includes name of the device, operating system, and browser you are using. Information collected may depend on the type of device you use and its settings.
  - **Cookies:** We use cookies to operate and administer our website and improve your experience on it. A “cookie” is a piece of information sent to your browser by a website you visit. You can set your browser to accept all cookies, to reject all cookies, or to notify you whenever a cookie is offered so that you can decide each time whether to accept it. However, refusing a cookie may, in some cases, preclude you from using or negatively affecting the display or function of a website or certain areas or features of a website.
  - **Analytics:** We may use a variety of online analytics products that use cookies to help us analyze how users use our website and enhance your experience when you use the website.

  Our use of cookies to process information is explained in Section 4 of this policy.

  3.2. Aggregated or De-Identified Non-Personal Information. We may aggregate or de-identify personal information so that it becomes non-personal information and use the aggregated information to analyze the effectiveness of our website, to improve and add features to our website, to conduct research, and for other similar purposes. In addition, from time to time, we may analyze the general behavior and characteristics of users of our website and share aggregated information like general user statistics with third parties, publish such aggregated information, or make such aggregated information generally available. We may collect aggregated information through the website, through cookies, and through other means described in this Privacy Policy. We will maintain and use de-identified information in anonymous or de-identified form, and we will not attempt to reidentify the information.

  3.3. Where we need to collect personal data by law or under the terms of a contract we have with you, and you fail to provide that data when requested, we may not be able to perform the contract we have or are trying to enter into with you (for example, to provide you with goods or services). In this case, we may have to cancel a product or service you have with us, but we will notify you if this is the case at the time.
  `;

  const markdownContent5 = `
  4.1. This site uses cookies to enable us to improve our service to you and to provide certain features that you may find useful. You may visit the Privacy Preference Center on the website to manage your consent preferences.

  4.2. Cookies are small text files that are transferred to your computer’s hard drive through your web browser to enable us to recognize your browser and help us track visitors to our site. A cookie contains your contact information and information to allow us to identify your computer when you travel around our site for the purpose of helping you accomplish your purpose. Most web browsers automatically accept cookies, but if you wish, you can set your browser to prevent it from accepting cookies. The “help” portion of the toolbar on most browsers will tell you how to prevent your browser from accepting new cookies and how to have the browser notify you when you receive a new cookie.

  4.3. We use cookies to monitor customer traffic patterns and site usage to help us develop the design and layout of the website.

  4.4. A number of cookies and similar technologies we use last only for the duration of your web session and expire when you close your browser or exit the website. Others are used to remember you when you return to the website and will last for longer.

  4.5. We use these cookies and other technologies on the basis that they are necessary for the performance of a service to you, or because using them is in our legitimate interests (where we have considered that these are not overridden by your rights), and, in some cases, where required by law, where you have consented to their use.

  4.6. We use the following types of cookies:

  - **4.6.1. Strictly necessary cookies.** These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you, which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not work. These cookies do not store any personally identifiable information.
  
  - **4.6.2. Performance cookies.** These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and, therefore, anonymous. If you do not allow these cookies, we will not know when you have visited our site and will not be able to monitor its performance.
  
  - **4.6.3. Functionality cookies.** These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, then some or all of these services may not function properly.
  
  - **4.6.4. Targeting/Advertising cookies.** These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information but are based on uniquely identifying your browser and internet device. If you do not allow these cookies, you will experience less targeted advertising.
  
  - **4.6.5.** We may also work with advertising networks that gather information about the content on our website you visit and on information on other websites and services you visit. This may result in you seeing our advertisements when you visit other websites and services of third parties.

  4.7. The effect of disabling cookies depends on which cookies you disable, but, in general, the website may not operate properly if all cookies are switched off. If you want to disable cookies on our site, you need to change your website browser settings under the Privacy Preference Center to reject cookies. How you can do this will depend on the browser you use. Further details on how to disable cookies for the most popular browsers are found on the following links:

  - For Microsoft Edge: [https://support.microsoft.online/en-ie/help/17442/windows-internet-explorer-delete-manage-cookies](https://support.microsoft.online/en-ie/help/17442/windows-internet-explorer-delete-manage-cookies)
  - For Google Chrome: [https://support.google.online/chrome/bin/answer.py?hl=en&answer=95647&p=cpn_cookies](https://support.google.online/chrome/bin/answer.py?hl=en&answer=95647&p=cpn_cookies)
  - For Safari: [https://support.apple.online/en-ie/guide/safari/sfri11471/mac](https://support.apple.online/en-ie/guide/safari/sfri11471/mac)
  - For Mozilla Firefox: [http://support.mozilla.org/en-US/kb/Cookies](http://support.mozilla.org/en-US/kb/Cookies)
  - For Opera 6.0 and further: [https://help.opera.online/en/latest/web-preferences/](https://help.opera.online/en/latest/web-preferences/)
  `;
  const markdownContent6 = `
  A cookie is a small piece of data (text file) that a website – when visited by a user – asks your browser to store on your device in order to remember information about you, such as your language preference or login information. Those cookies are set by us and called first-party cookies. We also use third-party cookies – which are cookies from a domain different than the domain of the website you are visiting – for our advertising and marketing efforts. More specifically, we use cookies and other tracking technologies for the following purposes:
  `;

  const markdownContent7 = `
These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies then some or all of these services may not function properly.
`;

  const markdownContent8 = `
These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies then some or all of these services may not function properly.
`;
  const markdownContent9 = `
6.1. The length of time for which we retain your personal data depends on the type of personal data and the purposes for which we are processing it. We will only retain your personal data for as long as necessary to fulfill the purposes 6.1. The length of time for which we retain your personal data depends on the type of personal data and the purposes for which we are processing it. We will only retain your personal data for as long as necessary to fulfill the purposes

6.1.1. To perform the services requested, for example, if you fill out the “How can we help you?” Web form, we will use the information provided to contact you about your request. This data processing is necessary to provide or fulfill a service requested by or for you, which is in our legitimate business interest.

6.2. To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure of your personal data, the purposes for which we process your personal data and whether we can achieve those purposes through other means, and the applicable legal requirements. If you would like more information about our retention periods, please contact us at [support@skillbnk.ai](mailto:support@skillbnk.ai).
`;
  const markdownContent10 = `
7.1. Where we are relying upon your consent for the processing of your personal data, you may withdraw consent without detriment at any time by providing an unambiguous indication of your wishes by which you, by a statement or by clear affirmative action, signify withdrawal of consent to the processing of personal data relating to you. If you have any queries relating to withdrawing your consent, please contact skillBNK’s data protection manager using the contact details set out below.

7.2. Withdrawal of consent shall be without effect to the lawfulness of processing based on consent before its withdrawal.
`;
  const markdownContent11 = `
8.1. We take appropriate security measures against unlawful or unauthorized processing of personal data and against the accidental loss of or damage to, personal data.

8.2. We have put in place procedures and technologies to maintain the security of all personal data from the point of collection to the point of destruction. Personal data will only be transferred to a data processor if they agree to comply with those procedures and policies or if they put in place adequate measures themself. In addition, we have appropriate written agreements in place with all our data processors.

8.3. We maintain data security by protecting the confidentiality, integrity, and availability of the personal data, defined as follows:

- Confidentiality means that only people who are authorized to use the data can access it.
- Integrity means that personal data should be accurate and suitable for the purpose for which it is processed.
- Availability means that authorized users should be able to access the data if they need it for authorized purposes.

8.4. We follow strict security procedures in the storage and disclosure of your personal data and protect it against accidental loss, destruction, or damage. skillBNK uses third-party vendors and hosting partners to provide the necessary hardware, software networking, storage, and related technology required to run. The data you provide to us is protected using modern encryption, intrusion prevention, and account access techniques.

`;

  const markdownContent12 = `
  9.1. When we transfer your personal data out of the EEA, we ensure an adequate degree of protection is afforded to it by ensuring at least one of the following safeguards is implemented.

  9.2. We may transfer your personal data to countries that have been deemed to provide an adequate level of protection for personal data by the European Commission. For further details, see European Commission: [Adequacy of the protection of personal data in non-EU countries](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en).

  9.3. Where we use certain service providers, we may use specific contracts approved by the European Commission, which give personal data the same protection it has in Europe. For further details, see European Commission: [Model contracts for the transfer of personal data to third countries](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en).

  9.4. Please contact us if you want further information on the specific mechanism used by us when transferring your personal data out of the EEA.

  9.1.3. We can only then process the personal data that we have collected for the purposes that we have identified or for purposes that are compatible with the purposes that we have identified.

  9.1.4. The personal data that we collect and process must be adequate, relevant, and limited to what is necessary for the purposes.

  9.1.5. The personal data that we collect and process must be accurate and (where necessary) kept up to date.

  9.1.6. We must not keep personal data any longer than is necessary, bearing the purpose for which we collected it. This includes that we should keep personal data in a form that permits identification of the data subject for no longer than is necessary.

  9.1.7. We must keep personal data safe and secure from unauthorized access, deletion, disclosure, or other unauthorized uses. This includes not just keeping data safe and secure from persons outside our organization but also from people within our organization who have no need to access or use personal data. We must also be careful when transferring personal data outside the European Economic Area (“EEA,” being the EU plus Norway, Liechtenstein, and Iceland) and make sure that we have a valid legal basis on which to transfer that data. Transfer can include using a cloud server that is located outside the EU or allowing people who are located outside the EEA access to personal data that is stored within the EEA.

  9.1.8. We must comply with data subjects’ rights of information about, and (separately) access to, their personal data and with their other data protection rights, including rights to correct or erase their personal data, rights “to be forgotten”, rights to object to processing (including profiling), rights against automated decision-making and (under the GDPR) rights to data portability.
`;
  const markdownContent13 = `
  10.1. We may disclose your information to trusted third parties for the purposes set out in Section 3. We require all third parties to have appropriate technical and operational security measures in place to protect your personal data, in line with EU laws on data protection. Any such company or individual will have access to personal information needed to perform these functions but may not use it for any other purpose.

  10.2. Specifically, we need to have written agreements in place with all our data processors and before we sign each agreement, we need to have vetted and be satisfied with the processor’s data security. The agreements also need to contain specific clauses that deal with data protection.

  10.3. We may pass on your details if we are under a duty to disclose or share a data subject’s personal data in order to comply with any legal obligation or in order to enforce or apply any contract with the data subject or other agreements; or to protect our rights, property, or safety of our employees, customers, or others. This includes reporting information about incidents (as appropriate) to the law enforcement authorities and responding to any requirements from law enforcement authorities to provide information and/or personal data to them for the purposes of detecting, investigating, and/or prosecuting offenses or in connection with crime sentencing.

  10.4. We may share your personal data with third parties in the event that we sell or buy any business assets, in which case we will disclose your personal data to the prospective seller or buyer of such business or assets subject to the terms of this privacy policy.

  10.5. We need to demonstrate accountability for our data protection obligations. This means that we must be able to show how we comply with the data protection rules and that we have in fact complied with the rules. We do this, among other ways, by our written policies and procedures, by building data protection compliance into our systems and business rules, by internally monitoring our data protection compliance and keeping it under review, and by taking action if our employees or contractors fail to follow the rules. We also have certain obligations in relation to keeping records about our data processing.
  `;
  const markdownContent14 = `
  11.1 COPPA. Our Service is not directed to children who are under the age of 13 in compliance with the U.S. Children’s Online Privacy Protection Act (COPPA). We do not knowingly collect Personal Information from children under the age of 13. If you have reason to believe that a child under the age of 13 has provided Personal Information to us, please contact skillBNK as provided in the “Contact Us” section below. We will investigate any notification and if appropriate, delete the Personal Information from our systems. If you are 13 or older but under 18, you must have consent from your parent or guardian to use our Services.

  11.2 Children. The Services and the Site are only intended for individuals who are at least 18 years of age, and we do not knowingly encourage or solicit users of the Services who are under the age of 18 or knowingly collect Personal Information from anyone under the age of 18 without parental fiduciary consent. If we learn we have collected or received Personal Information from a child under 16 without verification of parental consent, we will delete that information. If You believe we might have any information from or about a child under 16, please contact us in accordance with the “How to Contact Us” section below.
`;
  const markdownContent15 = `
  12.1. We strive to provide you with choices regarding certain personal data uses, particularly around marketing and advertising. At the point at which you provide us with your personal data, you will be asked whether you wish to receive any marketing communications from us.

  12.2. We may use your personal data to form a view on what we think you may want or need or what may be of interest to you. This is how we decide which products, services, and offers may be relevant for you (we call this marketing).
  
  12.3. We will not share your personal data with any third party for marketing purposes.
  
  12.4. You can object to further marketing at any time by selecting the “unsubscribe” link at the end of all our marketing and promotional update communications to you or by sending us an email to [support@skillbnk.ai](support@skillbnk.ai).
`;
  const markdownContent16 = `
  13.1. Situations may arise where it is necessary to transfer information (including your personal data) to a third party in the event of a sale, merger, liquidation, receivership, or transfer of all or substantially all of the assets of our company provided that the third party agrees to adhere to the terms of the Privacy Policy and provided that the third party only uses your personal data for the purposes that you provided it to us. The personal data transferred will be limited to that which is absolutely necessary. You will be notified in the event of any such transfer, and you will be afforded an opportunity to opt out.`;

  const markdownContent17 = `
  14.1. You have choices in how your personal data is used and shared. In addition to the rights specified in this section, under applicable law, You may have additional or more specific rights, which we will respect. You have the right to:

  (a) Know and access the personal information we hold about you (a data access request);

  (b) Receive personal data you have provided to us and request that we transmit this data directly to another controller (a data portability request).

  \\(c\\) Request access to your personal information (commonly known as a “data subject access request”). This enables you to receive a copy of the personal information we hold about you and to check that we are lawfully processing it.

  (d) Request correction of the personal information that we hold about you. This enables you to have any incomplete or inaccurate information we hold about you corrected.

  (e) Request the erasure of your personal information. This enables you to ask us to delete or remove personal information where there is no good reason for us continuing to process it. You also have the right to ask us to delete or remove your personal information where you have exercised your right to object to processing (see below).

  (f) Object to processing of your personal information where we are relying on a legitimate interest (or those of a third party), and there is something about your particular situation that makes you want to object to processing on this ground. You also have the right to object where we are processing your personal information for direct marketing purposes.

  (g) Not be subjected to automated decision-making, including profiling, which is not to be subject to any automated decision-making by us using your personal information or profiling of you.

  (h) Request the restriction of processing of your personal information. This enables you to ask us to suspend the processing of personal information about you, for example, if you want us to establish its accuracy or the reason for processing it.

  (i) Request transfer of your personal information in an electronic and structured form to you or to another party (commonly known as a right to “data portability”). This enables you to take your data from us in an electronically useable format and to be able to transfer your data to another party in an electronically useable format.
  `;

  const markdownContent18 = `
  15.1 Shine the Light. Shine the Light Under California’s “Shine the Light” law, California residents who provide personal information in obtaining products or services for personal, family, or household use are entitled to request and obtain from us, once a calendar year, information about the customer information we shared, if any, with other businesses for their own direct marketing uses. If applicable, this information would include the categories of customer information and the names and addresses of those businesses with which we shared customer information for the immediately prior calendar year. To obtain this information, please see the “Contact Us” section below and contact us with “Request for California Privacy Information” in the subject line and in the body of your message. We will provide the requested information to you at your email address in response. Please be aware that not all information sharing is covered by the “Shine the Light” requirements, and only information on covered sharing will be included in our response.

  15.2 California Consumer Privacy Act.

  15.2.1 Right to Know. Under the California Consumer Privacy Act and its implementing regulations, as amended effective January 1, 2023, by the California Privacy Rights Act and its implementing regulations (the two laws collectively, as amended, restated, or supplemented from time-to-time, the “CCPA/CPRA”), California Residents have the right to request the following information from skillBNK (in accordance with the “Contact Us” section below) and skillBNK will provide the following information to you upon verification of your identity:

  - The categories of Personal Information skillBNK collects about you.
  - The categories of sources from which your Personal Information is collected.
  - The business purpose for collecting your Personal Information.
  - The categories of third parties with whom skillBNK shares your Personal Information.
  - The specific pieces of Personal Information skillBNK has collected about you.

  Annex 1 outlines the categories of Personal Information in greater detail that we collect, and that may be submitted through the website. In addition, please check the following section of this Privacy Policy: Types Of Information We Collect and Purposes and Legal Basis for Use of Personal Information.

  15.3 Right to Deletion. You have the right to request that we delete any personal information we have collected from you or maintain about you. We honor such requests unless an exception applies, such as when the information is necessary to complete the transaction or contract for which it was collected or when information is being used to detect, prevent, or investigate security incidents, comply with laws or legal obligations, identify and repair bugs, or ensure another consumer’s ability to exercise their free speech rights or other rights provided by law.

  15.4 Opt Out. You may opt out of any marketing by us and from the disclosure of your Personal Information to third parties.

  15.5 Right to Correct Inaccurate Personal Information. You have the right to request that we correct inaccurate personal information. We will use commercially reasonable efforts to correct your personal information as directed by you.

  15.6 Non-Discrimination. If you elect to exercise any of your rights under CCPA/CPRA, skillBNK will not discriminate against you for exercising any of your CCPA/CPRA rights. Unless otherwise permitted by the CCPA/CPRA, we will not deny you goods or services, charge you a different price or rate for our goods or services, or provide you a different level or quality of goods or services because you exercised such rights. Under the current definition of CCPA/CPRA, skillBNK does not sell your Personal Information.
  `;
  const markdownContent19 = `
  If you are a California resident who is under the age of 16 and you are unable to remove publicly available content that you have submitted to us, you may request removal by contacting us at the Contact Us information below. When requesting removal, you must be specific about the information you want removed and provide us with specific information, such as the URL for each page where the information was entered, so that we can find it. We are not required to remove any content or information that (1) federal or state law requires us or a third party to maintain; (2) was not posted by you; (3) is anonymized so that you cannot be identified; (4) you don’t follow our instructions for removing or requesting removal; or (5) you received compensation or other consideration for providing the content or information. Removal of your content or information from the Service does not ensure complete or comprehensive removal of that content or information from our systems or the systems of our service providers. We are not required to delete the content or information posted by you; our obligations under California law are satisfied so long as we anonymize the content or information or render it invisible to other users and the public.
  `;

  const markdownContent20 = `
  17.1 The disclosures in this section apply solely to individual residents of the states of Colorado, Connecticut, Virginia, and Utah. Privacy laws in these states give residents certain rights with respect to their personal data when they take effect over the course of 2023. Those rights include:

  - **Right to Request Access:** You have the right to access and obtain a copy of the personal data that we hold about you.
  - **Right to Request Deletion:** You have the right to request that we delete personal data that we hold about you.
  - **Right to Correct:** You have the right to correct inaccuracies in your personal data.
  - **Right to Portable Data:** You have the right to request that we provide you a copy of personal data that you previously provided to us in a portable and, to the extent technically feasible, readily usable format that allows you to transmit the data to another business, where our processing is carried out by automated means.

  17.2 To submit a request to exercise your access, deletion, or correction of privacy rights, please submit a request as provided in the “Contact Us” section below from the email address that you believe is associated with your account, if applicable. In the request, please specify which right you are seeking to exercise and the personal data with respect to which you want to exercise this right.

  17.3 Please note that these rights are subject to certain exceptions. If you are a Colorado, Connecticut, or Virginia resident and we deny your request to exercise any of the rights above, you may appeal our denial of your request by contacting us via one of the contact methods specified at the end of this Policy.
  `;
  const markdownContent21 = `
  For residents of the State of Nevada, Chapter 603A of the Nevada Revised Statutes permits a Nevada resident to opt out of sales of certain covered information that a website operator has collected or will collect about the resident. We do not currently sell covered information.
  `;

  const markdownContent22 = `
  a. We have appointed a data protection manager to monitor compliance with our data protection obligations and with this policy and our related policies. If you have any questions about this policy or about our data protection compliance, please contact the data protection manager.

  b. Data subjects can make a request for personal data we hold about them or otherwise to exercise their data protection rights by contacting our data protection manager, who will respond to the request within 30 days.
  `;
  const markdownContent23 = `
  
Telephone: +1586 876 5513
Email: [support@skillbnk.ai](support@skillbnk.ai)
  `;

  const markdownContent24 = `
  a. Any changes to this Privacy Policy will be posted on this website so you are always aware of what information we collect, how we use it, and under what circumstances, if any, we disclose it. If at any time we decide to use personal data in a manner significantly different from that stated in this Privacy Policy or otherwise disclosed to you at the time it was collected, we will notify you by email, and you will have a choice as to whether or not we use your information in the new manner.
  `;

  const markdownContent25 = `
  Types of Information We Collect: In particular, we collect (and have collected in the past twelve months) the following categories of Personal Information from Customers, Authorized Users, and visitors to our Sites:
  `;
  const data = [
    {
      purpose:
        'Providing the website and performing our services to respond to requests, for example, if you fill out the “How can we help you?” Web form, we will use the information provided to contact you About your request.',
      basis:
        'Our legitimate business interests. Where necessary to enter into or perform a contract with You (upon Your request, or as necessary to make the Services available) Compliance with law As necessary to establish, exercise, and defend legal claims',
    },
    {
      purpose: 'Performing contractual obligations',
      basis:
        'Our legitimate business interests. Where necessary to enter into or perform a contract with You (upon Your request, or as necessary to make the Services available) Compliance with law As necessary to establish, exercise, and defend legal claims',
    },
    {
      purpose: 'Sales and business engagement',
      basis:
        'Our legitimate business interests. Where necessary to enter into or perform a contract with You (upon Your request, or as necessary to make the Services available) Compliance with law As necessary to establish, exercise, and defend legal claims',
    },
    {
      purpose: 'Personalization of the website',
      basis: 'Our legitimate business interests',
    },
    {
      purpose:
        'Marketing and promotions: we may use the information you provide to contact you to further Discuss your interest in the service and send you information regarding the company, such as our Products, services, or events.',
      basis: 'Our legitimate business interests. With Your consent',
    },
    {
      purpose: 'Advertising',
      basis: 'Our legitimate business interests. With Your consent',
    },
    {
      purpose:
        'Analytics and development to operate and improve our website. For example, we may analyze and process information for the purpose of improving the customer experience',
      basis: 'Our legitimate business interests',
    },
    {
      purpose: 'Purposes of Processing (see above)',
      basis: 'Legal Basis of Processing',
    },
    {
      purpose:
        'Compliance with Laws, for example, may share your Personal Data with various government authorities in response to subpoenas, court orders, or other legal processes; to establish or exercise our legal rights or to protect our property; to defend against legal claims; or as otherwise required by Law.',
      basis:
        'Legitimate business interests Compliance with law As necessary to establish, exercise, and defend legal claims',
    },
    {
      purpose:
        'Business and legal operations, for example, to assess your suitability for a role at skillBNK and invite you to interview',
      basis:
        'Our legitimate business interests. Compliance with law As necessary to establish, exercise, and defend legal claims',
    },
    {
      purpose: 'Prevent misuse',
      basis:
        'Our legitimate business interests. Compliance with law As necessary to establish, exercise, and defend legal claims',
    },
  ];

  const dataTwo = [
    {
      category: 'A. Identifiers',
      examples:
        'A real name, alias, postal address, unique personal identifier, online identifier, Internet Protocol (“IP”) address, email address, account name., software and identification numbers associated with your devices and other similar identifiers.',
    },
    {
      category:
        'B. Personal information categories listed in the California Customer Records statute (Cal. Civ. Code § 1798.80(e))',
      examples:
        'A name, signature, address, telephone number. Some personal information included in this category may overlap with other categories.',
    },
    {
      category: 'C. Commercial information',
      examples:
        'Records of products or services purchased by you or considered by you.',
    },
    {
      category: 'D. Internet or other similar network activity',
      examples:
        'Browsing history, search history, information on a consumer’s interaction with a website, application, or advertisement, locale preferences, your mobile carrier, date and time stamps associated with transactions and system configuration information.',
    },
    {
      category: 'E. Geolocation data',
      examples:
        'Physical location or movements, or your IP address. For purposes of this Privacy Policy, this does not include “precise” geolocation data.',
    },
    {
      category:
        'F. Sensory data (audio, visual, electronic, or other similar information)',
      examples:
        'We may collect audio or visual recordings when you elect to use certain service features.',
    },
    {
      category: 'G. Inferences',
      examples:
        'We may collect information about your preferences, characteristics, behavior, and attitudes.',
    },
    {
      category: 'H. Professional or Employment Information',
      examples:
        'We may collect professional or employment-related information or educational information, such as your job title, professional affiliations, and employment history, but only to the extent voluntarily provided by you or made available to us by trusted third parties.',
    },
    {
      category: 'I. Sensitive Personal Information',
      examples:
        'When you log into or use our Services, we may collect account log-in data in combination with a security or access code, password, or credentials to authenticate and enable access to your accounts. We collect such information directly from you through your interactions with our services or web pages and, in some cases, from third-party user identification or authentication services that you utilize. We do not sell or share (as such terms are defined by the CCPA) this information.',
    },
  ];

  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <ScrollView
      style={[styles.container, {paddingTop: top + responsiveScreenHeight(2)}]}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Foreground}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />
      <View
        style={{
          flexDirection: 'row',
          gap: responsiveScreenWidth(18),
          marginBottom: responsiveScreenHeight(2),
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-start',
          }}>
          <ArrowLeft />
          {/* <Text
            style={{
              marginLeft: 10,
              fontFamily: CustomFonts.MEDIUM,
              fontSize: responsiveScreenFontSize(2),
              color: Colors.BodyText,
            }}>
            Back
          </Text> */}
        </TouchableOpacity>
        <Text style={styles.headingTop}>Privacy & Policy</Text>
      </View>
      <Text style={styles.normalText}>
        "skillBNK" is a white-label platform designed to provide comprehensive
        school solutions. White-label platforms typically offer customizable
        software or services that businesses can brand and use as their own. In
        the context of schools, a white-label platform like "skillBNK" might
        offer various features and functionalities to help schools automate
        their processes and enhance the learning experience for students.
      </Text>
      <SectionHeading
        heading={
          'Some of the common features and functionalities such platforms might offer include:'
        }
      />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent1}
      </Markdown>
      <Text style={styles.normalText}>
        It's important to note that the success of such a platform depends on
        its usability, reliability, and the specific needs of the schools and
        students it serves. Features like these can greatly enhance the
        efficiency of school operations and improve the educational experience,
        but the platform's implementation and support are also crucial factors
        to consider.
      </Text>
      <SectionHeading heading={'1. Introduction'} />

      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent2}
      </Markdown>

      <SectionHeading heading={'2. Data Controller'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent3}
      </Markdown>
      <SectionHeading heading={'3. Types of Information We Collect.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent4}
      </Markdown>
      <SectionHeading heading={'4. Cookies.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent5}
      </Markdown>
      <View style={{height: 20}} />
      <SectionHeading heading={'Cookie-List'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent6}
      </Markdown>
      <SectionHeading heading={'Performance Cookies'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent7}
      </Markdown>
      <SectionHeading heading={'Functional Cookies'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent8}
      </Markdown>
      <SectionHeading
        heading={'5. Purposes and Legal Basis for Use of Personal Information.'}
        text={
          'We use the Personal Information we collect for our legitimate business interests, which include the following purposes:        '
        }
      />

      <View style={[styles.table, {marginTop: 20}]}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell]}>
            Purposes of Processing (see above)
          </Text>
          <Text style={[styles.cell, styles.headerCell, styles.lastCell]}>
            Legal Basis of Processing
          </Text>
        </View>
        {data.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cell, styles.leftCell]}>{item.purpose}</Text>
            <Text style={[styles.cell, styles.rightCell]}>{item.basis}</Text>
          </View>
        ))}
      </View>
      <SectionHeading heading={'6. Data Retention.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent9}
      </Markdown>
      <SectionHeading heading={'7. Consent.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent10}
      </Markdown>
      <SectionHeading heading={'8. Security of your Personal Data.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent11}
      </Markdown>
      <SectionHeading heading={'9. International Transfers.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent12}
      </Markdown>
      <SectionHeading
        heading={'10. Will we share your information with anyone else?'}
      />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent13}
      </Markdown>
      <SectionHeading heading={'11. Minor’s Privacy.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent14}
      </Markdown>
      <SectionHeading heading={'12. Marketing.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent15}
      </Markdown>
      <SectionHeading heading={'13. Sale of Business.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent16}
      </Markdown>
      <SectionHeading heading={'14. Your Personal Information Rights.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent17}
      </Markdown>
      <SectionHeading heading={'15. California Privacy Rights.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent18}
      </Markdown>
      <SectionHeading heading={'16. California Minors.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent19}
      </Markdown>
      <SectionHeading
        heading={
          '17. Privacy Notice to Residents of Colorado, Connecticut, Virginia, and Utah.'
        }
      />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent20}
      </Markdown>
      <SectionHeading heading={'18. Privacy Notice for Residents of Nevada.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent21}
      </Markdown>
      <SectionHeading
        heading={'19. Requests by Data Subjects to exercise their rights.'}
      />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent22}
      </Markdown>
      <SectionHeading
        heading={'20. Contact Us.'}
        text={'Our data protection manager can be contacted as follows:'}
      />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent23}
      </Markdown>
      <SectionHeading heading={'21. Changes to the Privacy Policy.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent24}
      </Markdown>
      <SectionHeading heading={'22. Annex 1 - California Privacy Rights.'} />
      <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
        {markdownContent25}
      </Markdown>

      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell]}>Category</Text>
          <Text style={[styles.cell, styles.headerCell, styles.lastCell]}>
            Examples
          </Text>
        </View>
        {dataTwo?.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cell, styles.leftCell]}>{item.category}</Text>
            <Text style={[styles.cell, styles.lastCell, styles.rightCell]}>
              {item.examples}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default PrivacyPolicyScreen;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    leftCell: {
      fontFamily: CustomFonts.MEDIUM,
      //   textAlign: "justify",
      color: Colors.Heading,
    },
    rightCell: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    headerCell: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
    },
    table: {
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.LineColor,
      borderRadius: 5,
      marginBottom: 20,
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: Colors.LineColor,
    },
    headerRow: {
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    cell: {
      flex: 1,
      padding: 10,
      borderRightWidth: 1,
      borderRightColor: Colors.LineColor,
    },
    lastCell: {
      borderRightWidth: 0,
    },
    markdownStyle: {
      body: {
        color: Colors.BodyText,
        // fontSize: 16,

        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: responsiveScreenHeight(1.5),
      },
      heading1: {
        fontSize: 24,
        color: '#000',
        marginBottom: 10,
      },
      heading2: {
        fontSize: 20,
        color: '#000',
        marginBottom: 8,
      },
      heading3: {
        fontSize: 18,
        color: '#000',
        marginBottom: 6,
      },
      paragraph: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        color: Colors.Primary,
        // marginBottom: 100,
      },
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
    } as any,
    normalText: {
      textAlign: 'justify',
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      marginBottom: 10,
      lineHeight: 20,
    },
    headingTop: {
      fontSize: responsiveScreenFontSize(2.5),
      textAlign: 'center',
      //   paddingTop: responsiveScreenHeight(),
      paddingBottom: responsiveScreenHeight(0.5),
      color: Colors.Heading,
      textDecorationLine: 'underline',
      alignSelf: 'center',
    },
    container: {
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1.5),
      // backgroundColor: "red",
      backgroundColor: Colors.Background_color,
      //   paddingBottom: 20,
      position: 'relative',
    },
  });
