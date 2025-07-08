import { buttonTheme } from "@/app/styles/buttonTheme/theme";
import { Box, Button } from "@mui/material";

export default function Gestao() {
    return (
        <Box className="w-full flex flex-wrap flex-row justify-around">
            <Box className="flex flex-col items-center justify-between gap-2 w-[28%] p-4 rounded-sm h-[400px] border-1 border-[#5e58731f]">
                <img className="w-full object-cover h-[50%]" src="https://itsoo.com.br/wp-content/uploads/2019/08/itsoo_portfolio_adcos-1_1196x699_acf_cropped-1.jpg" alt="empresa" />
                <span className='text-[#5E5873] text-[1.4rem] font-medium'>Adcos</span>
                <span className='text-[#5E5873] text-[.8rem]'>lLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not.</span>
                <Button sx={[buttonTheme, { width: "100%" }]} variant="contained" color="primary" className="mt-4">Acessar</Button>
            </Box>
            <Box className="flex flex-col items-center justify-between gap-2 w-[28%] p-4 rounded-sm h-[400px] border-1 border-[#5e58731f]">
                <img className="w-full object-cover h-[50%]" src="https://institutoideias.com.br/novo/wp-content/uploads/2024/04/62307264a39b9e9c515e5934.png" alt="empresa" />
                <span className='text-[#5E5873] text-[1.4rem] font-medium'>ArcelorMital</span>
                <span className='text-[#5E5873] text-[.8rem]'>lLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not.</span>
                <Button sx={[buttonTheme, { width: "100%" }]} variant="contained" color="primary" className="mt-4">Acessar</Button>
            </Box>
            <Box className="flex flex-col items-center justify-between gap-2 w-[28%] p-4 rounded-sm h-[400px] border-1 border-[#5e58731f]">
                <img className="w-full object-cover h-[50%]" src="https://tex.com.br/wp-content/uploads/2023/03/logo-nemak-2.png" alt="empresa" />
                <span className='text-[#5E5873] text-[1.4rem] font-medium'>Nemak</span>
                <span className='text-[#5E5873] text-[.8rem]'>lLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not.</span>
                <Button sx={[buttonTheme, { width: "100%" }]} variant="contained" color="primary" className="mt-4">Acessar</Button>
            </Box>
        </Box>
    )
}