import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { Box, Button } from "@mui/material";

export default function Gestao() {
    return (
        <Box className="w-full flex flex-wrap flex-row justify-around">
            <Box className="flex flex-col items-center justify-between gap-2 w-[28%] p-4 rounded-sm h-[400px] border-1 border-[#5e58731f]">
                <img className="w-full object-cover h-[50%]" src="https://images.pexels.com/photos/32938586/pexels-photo-32938586/free-photo-of-padrao.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="empresa" />
                <span className='text-[#5E5873] text-[1.4rem] font-medium'>Coqueria</span>
                <span className='text-[#5E5873] text-[.8rem]'>lLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not.</span>
                <Button sx={[buttonTheme, { width: "100%" }]} variant="contained" color="primary" className="mt-4">Acessar</Button>
            </Box>
            <Box className="flex flex-col items-center justify-between gap-2 w-[28%] p-4 rounded-sm h-[400px] border-1 border-[#5e58731f]">
                <img className="w-full object-cover h-[50%]" src="https://images.pexels.com/photos/29693635/pexels-photo-29693635/free-photo-of-vista-aerea-do-canteiro-de-obras-em-chattanooga.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="empresa" />
                <span className='text-[#5E5873] text-[1.4rem] font-medium'>Sinterização</span>
                <span className='text-[#5E5873] text-[.8rem]'>lLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not.</span>
                <Button sx={[buttonTheme, { width: "100%" }]} variant="contained" color="primary" className="mt-4">Acessar</Button>
            </Box>
            <Box className="flex flex-col items-center justify-between gap-2 w-[28%] p-4 rounded-sm h-[400px] border-1 border-[#5e58731f]">
                <img className="w-full object-cover h-[50%]" src="https://images.pexels.com/photos/29693632/pexels-photo-29693632/free-photo-of-vista-aerea-do-canteiro-de-obras-em-chattanooga.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="empresa" />
                <span className='text-[#5E5873] text-[1.4rem] font-medium'>Alto-Forno</span>
                <span className='text-[#5E5873] text-[.8rem]'>lLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not.</span>
                <Button sx={[buttonTheme, { width: "100%" }]} variant="contained" color="primary" className="mt-4">Acessar</Button>
            </Box>
        </Box>
    )
}