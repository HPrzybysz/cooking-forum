module.exports = {
    createTransport: () => ({
        sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
            callback(null, { messageId: 'test-message-id' });
        }),
        verify: jest.fn((callback) => callback(null, true))
    })
};