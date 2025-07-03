export type Meeting = {
  user_id?: number;
  id?: number;
  title: string;
  status: string;
  platform: string;
  video_link?: string;
  date: string;
  hour: string;
  pauta: string;
  duration?: number;
  transcricao_id?: number;
  transcricao?: Transcription;
  users?: MeetingUsers[] | any;
}

export type Transcription = {
  id?: number;
  resume: string;
  respostaPrompt: string;
  transcricao: string;
}


export type MeetingUsers = {
  name: string;
  photo?: string | any;
  occupation?: string;
  signed: boolean;
}

// export type MeetingForm = {
//   title: string;
//   summary: string;
//   platform: AvailablePlataform | "";
//   date: string;
//   users_id: number[]
// }

export type MeetingUpdate = {
  meeting: {
    id: number;
    title: string;
  };
  previous_status: string;
  current_status: string;
  date: string;
}