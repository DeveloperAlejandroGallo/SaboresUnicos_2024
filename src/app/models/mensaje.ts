export interface Mensaje {
    id: string;
    numeroDeMesa: number;
    nombreMozo:string;    
    mensaje:string; 
    idDelEnviador: string;
    //fecha:Date; //hora y minutos   
    fecha: number; 
}