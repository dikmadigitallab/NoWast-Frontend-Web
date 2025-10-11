export default function formatDate(dateString: string) {
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const [year, month, day] = dateString?.split('-');

    const formattedDate = `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;

    return formattedDate;
}

/**
 * Converte uma data ISO string para o formato datetime-local (YYYY-MM-DDTHH:mm)
 * mantendo o fuso horário local brasileiro
 */
export function formatDateTimeLocalFromISO(isoString: string): string {
    if (!isoString) return "";
    
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Converte o valor do input datetime-local (em horário local) para ISO string UTC
 * O input datetime-local trabalha com hora local (sem timezone)
 * Usado no formulário de CADASTRO
 */
export function formatISOFromDateTimeLocal(dateTimeLocalValue: string): string {
    if (!dateTimeLocalValue) return "";
    
    // O input datetime-local retorna no formato: YYYY-MM-DDTHH:mm
    // Quando criamos um Date com esse valor, JavaScript interpreta como hora local
    const date = new Date(dateTimeLocalValue);
    
    // toISOString() converte para UTC
    return date.toISOString();
}

/**
 * Formata uma data ISO string para exibição no formato brasileiro
 * Ex: "18/10/2025 às 10:23"
 */
export function formatDateTimeBrazilian(isoString: string): string {
    if (!isoString) return "";
    
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
}
