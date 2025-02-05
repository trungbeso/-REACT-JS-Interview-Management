export enum Role {
  Admin = 'ADMIN',
  Manager = 'MANAGER',
  Recruiter = 'RECRUITER',
  Interviewer = 'INTERVIEWER',
  Candidate = 'CANDIDATE',
}

export enum InterviewStatus {
  New = 'NEW',
  Invited = 'INVITED',
  Interviewed = 'INTERVIEWED',
  Cancelled = 'CANCELLED',
}

export enum InterviewResult {
  NA = 'NA',
  Pass = 'PASSED',
  Fail = 'FAILED',
}

export enum JobStatus {
  Draft = 'DRAFT',
  Open = 'OPEN',
  Closed = 'CLOSED',
}

export enum CandidateStatus {
  Open = 'OPEN',
  WaitingForInterview = 'WAITING_FOR_INTERVIEW',
  CancelledByInterview = 'CANCELLED_BY_INTERVIEW',
  PassedByInterview = 'PASSED_BY_INTERVIEW',
  FailedByInterview = 'FAILED_BY_INTERVIEW',
  WaitingForApproval = 'WAITING_FOR_APPROVAL',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  WaitingForResponse = 'WAITING_FOR_RESPONSE',
  AcceptedOffer = 'ACCEPTED_OFFER',
  DeclinedOffer = 'DECLINED_OFFER',
  CancelledOffer = 'CANCELLED_OFFER',
  Banned = 'BANNED',
}

export enum OfferStatus {
  WaitingForApproval = 'WAITING_FOR_APPROVAL',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  WaitingForResponse = 'WAITING_FOR_RESPONSE',
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Cancelled = 'CANCELLED_OFFER',
}

export enum Level {
  Junior = 'JUNIOR',
  Middle = 'MIDDLE',
  Senior = 'SENIOR',
  Fresher = 'FRESHER',
  SolutionArchitecture = 'SOLUTION_ARCHITECTURE',
}
