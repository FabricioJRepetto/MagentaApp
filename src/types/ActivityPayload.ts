import { User } from "./ViewSubmissionPayload"

export interface ActivityPayload {
    user: User,
    description: string,
    from: string,
    to: string,
    category: CATEGORY,
    subcategory: SUBCATEGORY,
    energy: number,
    emotion: EMOTION
}

export enum CATEGORY {
    PRODUCTIVIDAD = 'PRODUCTIVIDAD',
    OCIO = 'OCIO',
    DESCANSO = 'DESCANSO',
    AUTOCUIDADO = 'AUTOCUIDADO',
    INPRODUCTIVIDAD = 'INPRODUCTIVIDAD'
}

export enum SUBCATEGORY {
    TRABAJO = 'TRABAJO',
    ESTUDIO = 'ESTUDIO',
    ACTIVIDAD_FISICA = 'ACTIVIDAD_FISICA',
    SOCIALES = 'SOCIALES',
    ACTIVIDADES = 'ACTIVIDADES',
    ZAPPING = 'ZAPPING',
    DORMIR = 'DORMIR',
    MEDITACION = 'MEDITACION',
    COMER = 'COMER',
    DUCHA = 'DUCHA',
    MEDICO = 'MEDICO'
}

export enum EMOTION {
    ALEGRIA = 'ALEGRIA',
    CONFIANZA = 'CONFIANZA',
    MIEDO = 'MIEDO',
    SORPRESA = 'SORPRESA',
    TRISTEZA = 'TRISTEZA',
    TEDIO = 'TEDIO',
    ENFADO = 'ENFADO',
    INTERES = 'INTERES'
}