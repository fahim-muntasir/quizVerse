export type ParticipantResponseType = {
  success: boolean;
  message: string;
  code: number;
  data: {
    hasParticipated: boolean;
    _id: string;
  };
}
