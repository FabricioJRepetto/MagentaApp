export default (): string => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    return yesterday.toLocaleDateString('en-Us');
}