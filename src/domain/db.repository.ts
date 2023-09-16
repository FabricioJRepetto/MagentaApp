export default interface dbRepository {
    saveActivity(data: any): Promise<any>
}