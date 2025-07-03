export type IMeeting = {
    id: number;
    file: string;
    name: string;
    pauta: string;
    date: string;
    sigStatus: boolean;
    status: string;
    users: string[];
    duration: number;
    video_link: string;
    platform: string;
};
