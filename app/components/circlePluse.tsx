import { FaCircle } from "react-icons/fa";

export default function CirclePulse({
  status,
  ata,
}: {
  status?: string;
  ata?: boolean;
}) {
  const statusColor: Record<string, string> = {
    "call pendente": "#ebdd02",
    "call realizada": "#473219",
    "transcrição em andamento": "#473219",
    "transcrição finalizada": "#41ff5f",
    "assinatura pendente": "red",
  };

  return (
    <div
      style={{
        color: status ? statusColor[status] : undefined,
      }}
      className="h-[30px] w-[30px] rounded-full flex items-center justify-center p-2 animate-pulse bg-[#00000014]"
    >
      <FaCircle size={13} />
    </div>
  );
}
