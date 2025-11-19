import { axiosPublic } from '../axios';


export interface RT {
  id: string;
  name: string;
  region: string;
}

export interface RTResponse {
  rts: RT[];
}

export const getRTs = async (): Promise<RT[]> => {
  const response = await axiosPublic.get<RTResponse>('/rts');
  return response.data.rts;
};
