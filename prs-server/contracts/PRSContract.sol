pragma solidity ^0.4.0;
pragma experimental ABIEncoderV2;

contract PRSContract {
    // =================================
    // Structs Definition
    // =================================
    struct FeedbackInfo {
        bytes32 feedbackId;
        bytes32 email;
        bytes32 sessionId;
        bytes32 answerHash;
        uint256 timestamp;
    }

    struct UserInfo {
        bytes32[] listFeedbackId;
    }

    // =================================
    // Storage
    // =================================
    mapping(bytes32 => FeedbackInfo) feedbacks;
    mapping(bytes32 => UserInfo) userInfo;

    // =================================
    // Events
    // =================================
    event EventSendFeedback(
        bytes32 feedbackId,
        bytes32 email,
        bytes32 sessionId,
        bytes32 answerHash,
        uint256 timestamp
    );

    // =================================
    // Transactions - Write
    // =================================
    function sendFeedback(
        bytes32 feedbackId,
        bytes32 email,
        bytes32 sessionId,
        bytes32 answerHash,
        uint256 feedbackTimestamp
    ) public {
        feedbacks[feedbackId] = FeedbackInfo(
            feedbackId,
            email,
            sessionId,
            answerHash,
            feedbackTimestamp
        );
        userInfo[email].listFeedbackId.push(feedbackId);

        emit EventSendFeedback(
            feedbackId,
            email,
            sessionId,
            answerHash,
            feedbackTimestamp
        );
    }

    // =================================
    // Read smart contract
    // =================================
    function getFeedbackInfo(bytes32 feedbackId)
        public
        view
        returns (FeedbackInfo)
    {
        return feedbacks[feedbackId];
    }

    function getUserFeedbacks(bytes32 email) public view returns (UserInfo) {
        return userInfo[email];
    }
}
