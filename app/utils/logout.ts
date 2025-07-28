import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export const Logout = (auth?: boolean) => {
    if (typeof window === "undefined") return;

    document.cookie = `authToken=; Path=/; Max-Age=0`;
    localStorage.removeItem("user");
    localStorage.removeItem("meeting-storage");
    localStorage.removeItem("user-storage");
    localStorage.removeItem("id-storage");
    localStorage.removeItem("permissions");
    localStorage.removeItem("is-module-storage");

    if (auth) {
        toast.info("Token de autenticação não encontrado!");
    } else {
        toast.info("Logout realizado com sucesso!");
    }
    setTimeout(() => {
        redirect("/sign-in");
    }, 2000);
};