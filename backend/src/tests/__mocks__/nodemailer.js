module.exports = {
    createTransport: () => ({
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test' }),
        verify: jest.fn().mockResolvedValue(true)
    })
};