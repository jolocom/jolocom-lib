import { ContextEntry } from '@jolocom/protocol-ts';
export declare const defaultContext: {
    id: string;
    type: string;
    VerifiableCredential: string;
    cred: string;
    dc: string;
    sec: string;
    xsd: string;
    credentialSchema: string;
    JsonSchemaValidator2018: string;
    credentialStatus: string;
    credentialSubject: string;
    evidence: string;
    expirationDate: string;
    holder: string;
    issued: string;
    issuer: string;
    issuanceDate: string;
    proof: string;
    refreshService: string;
    termsOfUse: string;
    validFrom: string;
    validUntil: string;
    VerifiablePresentation: string;
    verifiableCredential: string;
    EcdsaSecp256k1Signature2019: string;
    claim: string;
    challenge: string;
    created: string;
    domain: string;
    expires: string;
    jws: string;
    nonce: string;
    proofPurpose: string;
    assertionMethod: string;
    authentication: string;
    proofValue: string;
    verificationMethod: string;
    EcdsaSecp256r1Signature2019: string;
    Ed25519Signature2018: string;
    EcdsaKoblitzSignature2016: string;
    Credential: string;
    credential: string;
    creator: string;
    signatureValue: string;
    email: string;
    ProofOfEmailCredential: string;
    ex: string;
    schema: string;
    rdf: string;
    '3rdPartyCorrelation': string;
    AllVerifiers: string;
    Archival: string;
    BachelorDegree: string;
    Child: string;
    CLCredentialDefinition2019: string;
    CLSignature2019: string;
    IssuerPolicy: string;
    HolderPolicy: string;
    Mother: string;
    RelationshipCredential: string;
    UniversityDegreeCredential: string;
    AlumniCredential: string;
    DisputeCredential: string;
    PrescriptionCredential: string;
    ZkpExampleSchema2018: string;
    issuerData: string;
    attributes: string;
    signature: string;
    signatureCorrectnessProof: string;
    primaryProof: string;
    nonRevocationProof: string;
    alumniOf: {
        '@id': string;
        '@type': string;
    };
    child: {
        '@id': string;
        '@type': string;
    };
    degree: string;
    degreeType: string;
    degreeSchool: string;
    college: string;
    name: {
        '@id': string;
        '@type': string;
    };
    givenName: string;
    familyName: string;
    parent: {
        '@id': string;
        '@type': string;
    };
    referenceId: string;
    documentPresence: string;
    evidenceDocument: string;
    spouse: string;
    subjectPresence: string;
    verifier: {
        '@id': string;
        '@type': string;
    };
    currentStatus: string;
    statusReason: string;
    prescription: string;
    odrl: string;
    rdfs: string;
    owl: string;
    skos: string;
    dct: string;
    vcard: string;
    foaf: string;
    cc: string;
    uid: string;
    Policy: string;
    Rule: string;
    profile: {
        '@type': string;
        '@id': string;
    };
    inheritFrom: {
        '@type': string;
        '@id': string;
    };
    ConflictTerm: string;
    conflict: {
        '@type': string;
        '@id': string;
    };
    perm: string;
    prohibit: string;
    invalid: string;
    Agreement: string;
    Assertion: string;
    Offer: string;
    Privacy: string;
    Request: string;
    Set: string;
    Ticket: string;
    Asset: string;
    AssetCollection: string;
    relation: {
        '@type': string;
        '@id': string;
    };
    hasPolicy: {
        '@type': string;
        '@id': string;
    };
    target: {
        '@type': string;
        '@id': string;
    };
    output: {
        '@type': string;
        '@id': string;
    };
    partOf: {
        '@type': string;
        '@id': string;
    };
    source: {
        '@type': string;
        '@id': string;
    };
    Party: string;
    PartyCollection: string;
    function: {
        '@type': string;
        '@id': string;
    };
    PartyScope: string;
    assignee: {
        '@type': string;
        '@id': string;
    };
    assigner: {
        '@type': string;
        '@id': string;
    };
    assigneeOf: {
        '@type': string;
        '@id': string;
    };
    assignerOf: {
        '@type': string;
        '@id': string;
    };
    attributedParty: {
        '@type': string;
        '@id': string;
    };
    attributingParty: {
        '@type': string;
        '@id': string;
    };
    compensatedParty: {
        '@type': string;
        '@id': string;
    };
    compensatingParty: {
        '@type': string;
        '@id': string;
    };
    consentingParty: {
        '@type': string;
        '@id': string;
    };
    consentedParty: {
        '@type': string;
        '@id': string;
    };
    informedParty: {
        '@type': string;
        '@id': string;
    };
    informingParty: {
        '@type': string;
        '@id': string;
    };
    trackingParty: {
        '@type': string;
        '@id': string;
    };
    trackedParty: {
        '@type': string;
        '@id': string;
    };
    contractingParty: {
        '@type': string;
        '@id': string;
    };
    contractedParty: {
        '@type': string;
        '@id': string;
    };
    Action: string;
    action: {
        '@type': string;
        '@id': string;
    };
    includedIn: {
        '@type': string;
        '@id': string;
    };
    implies: {
        '@type': string;
        '@id': string;
    };
    Permission: string;
    permission: {
        '@type': string;
        '@id': string;
    };
    Prohibition: string;
    prohibition: {
        '@type': string;
        '@id': string;
    };
    obligation: {
        '@type': string;
        '@id': string;
    };
    use: string;
    grantUse: string;
    aggregate: string;
    annotate: string;
    anonymize: string;
    archive: string;
    concurrentUse: string;
    derive: string;
    digitize: string;
    display: string;
    distribute: string;
    execute: string;
    extract: string;
    give: string;
    index: string;
    install: string;
    modify: string;
    move: string;
    play: string;
    present: string;
    print: string;
    read: string;
    reproduce: string;
    sell: string;
    stream: string;
    textToSpeech: string;
    transfer: string;
    transform: string;
    translate: string;
    Duty: string;
    duty: {
        '@type': string;
        '@id': string;
    };
    consequence: {
        '@type': string;
        '@id': string;
    };
    remedy: {
        '@type': string;
        '@id': string;
    };
    acceptTracking: string;
    attribute: string;
    compensate: string;
    delete: string;
    ensureExclusivity: string;
    include: string;
    inform: string;
    nextPolicy: string;
    obtainConsent: string;
    reviewPolicy: string;
    uninstall: string;
    watermark: string;
    Constraint: string;
    LogicalConstraint: string;
    constraint: {
        '@type': string;
        '@id': string;
    };
    refinement: {
        '@type': string;
        '@id': string;
    };
    Operator: string;
    operator: {
        '@type': string;
        '@id': string;
    };
    RightOperand: string;
    rightOperand: string;
    rightOperandReference: {
        '@type': string;
        '@id': string;
    };
    LeftOperand: string;
    leftOperand: {
        '@type': string;
        '@id': string;
    };
    unit: string;
    dataType: {
        '@type': string;
        '@id': string;
    };
    status: string;
    absolutePosition: string;
    absoluteSpatialPosition: string;
    absoluteTemporalPosition: string;
    absoluteSize: string;
    count: string;
    dateTime: string;
    delayPeriod: string;
    deliveryChannel: string;
    elapsedTime: string;
    event: string;
    fileFormat: string;
    industry: string;
    language: string;
    media: string;
    meteredTime: string;
    payAmount: string;
    percentage: string;
    product: string;
    purpose: string;
    recipient: string;
    relativePosition: string;
    relativeSpatialPosition: string;
    relativeTemporalPosition: string;
    relativeSize: string;
    resolution: string;
    spatial: string;
    spatialCoordinates: string;
    systemDevice: string;
    timeInterval: string;
    unitOfCount: string;
    version: string;
    virtualLocation: string;
    eq: string;
    gt: string;
    gteq: string;
    lt: string;
    lteq: string;
    neq: string;
    isA: string;
    hasPart: string;
    isPartOf: string;
    isAllOf: string;
    isAnyOf: string;
    isNoneOf: string;
    or: string;
    xone: string;
    and: string;
    andSequence: string;
    policyUsage: string;
    previousProof: string;
    ChainedProof2021: string;
    chainSignatureSuite: string;
}[];
export declare const defaultContextIdentity: ContextEntry[];
