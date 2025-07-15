import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { Box, Button } from "@mui/material";

export default function ADM_Cliente() {
    return (
        <Box className="w-full flex flex-wrap flex-row justify-around">
            <Box className="flex flex-col items-center justify-between gap-2 w-[28%] p-4 rounded-sm h-[400px] border-1 border-[#5e58731f]">
                <img className="w-full object-cover h-[50%]" src="https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="empresa" />
                <span className='text-[#5E5873] text-[1.4rem] font-medium'>Queda Zero</span>
                <span className='text-[#5E5873] text-[.8rem]'>lLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not.</span>
                <Button sx={[buttonTheme, { width: "100%" }]} variant="contained" color="primary" className="mt-4">Acessar</Button>
            </Box>
            <Box className="flex flex-col items-center justify-between gap-2 w-[28%] p-4 rounded-sm h-[400px] border-1 border-[#5e58731f]">
                <img className="w-full object-cover h-[50%]" src="https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="empresa" />
                <span className='text-[#5E5873] text-[1.4rem] font-medium'>SDO</span>
                <span className='text-[#5E5873] text-[.8rem]'>lLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not.</span>
                <Button sx={[buttonTheme, { width: "100%" }]} variant="contained" color="primary" className="mt-4">Acessar</Button>
            </Box>
            <Box className="flex flex-col items-center justify-between gap-2 w-[28%] p-4 rounded-sm h-[400px] border-1 border-[#5e58731f]">
                <img className="w-full object-cover h-[50%]" src="https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="empresa" />
                <span className='text-[#5E5873] text-[1.4rem] font-medium'>Coleta Seletiva</span>
                <span className='text-[#5E5873] text-[.8rem]'>lLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not.</span>
                <Button sx={[buttonTheme, { width: "100%" }]} variant="contained" color="primary" className="mt-4">Acessar</Button>
            </Box>
        </Box>
    )
}