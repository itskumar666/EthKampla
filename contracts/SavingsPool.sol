// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SavingsPool
 * @dev Simple micro-savings pool contract for African communities
 */
contract SavingsPool {
    struct Pool {
        string name;
        address creator;
        uint256 targetAmount;
        uint256 contributionAmount;
        uint256 duration; // in days
        uint256 createdAt;
        uint256 totalContributed;
        address[] members;
        bool isActive;
    }

    struct Member {
        uint256 totalContributed;
        uint256 lastContribution;
        bool isMember;
    }

    Pool[] public pools;
    mapping(uint256 => mapping(address => Member)) public poolMembers;

    event PoolCreated(uint256 indexed poolId, string name, address creator);
    event ContributionMade(uint256 indexed poolId, address indexed member, uint256 amount);
    event PoolCompleted(uint256 indexed poolId, uint256 totalAmount);
    event Withdrawal(uint256 indexed poolId, address indexed member, uint256 amount);

    /**
     * @dev Create a new savings pool
     */
    function createPool(
        string memory _name,
        uint256 _targetAmount,
        uint256 _contributionAmount,
        uint256 _durationDays
    ) external returns (uint256) {
        require(_targetAmount > 0, "Target must be > 0");
        require(_contributionAmount > 0, "Contribution must be > 0");
        require(_durationDays > 0, "Duration must be > 0");

        Pool storage newPool = pools.push();
        newPool.name = _name;
        newPool.creator = msg.sender;
        newPool.targetAmount = _targetAmount;
        newPool.contributionAmount = _contributionAmount;
        newPool.duration = _durationDays * 1 days;
        newPool.createdAt = block.timestamp;
        newPool.totalContributed = 0;
        newPool.isActive = true;

        uint256 poolId = pools.length - 1;
        emit PoolCreated(poolId, _name, msg.sender);
        
        return poolId;
    }

    /**
     * @dev Contribute to a pool
     */
    function contribute(uint256 _poolId) external payable {
        require(_poolId < pools.length, "Pool doesn't exist");
        Pool storage pool = pools[_poolId];
        require(pool.isActive, "Pool not active");
        require(msg.value >= pool.contributionAmount, "Insufficient contribution");

        Member storage member = poolMembers[_poolId][msg.sender];
        
        if (!member.isMember) {
            member.isMember = true;
            pool.members.push(msg.sender);
        }

        member.totalContributed += msg.value;
        member.lastContribution = block.timestamp;
        pool.totalContributed += msg.value;

        emit ContributionMade(_poolId, msg.sender, msg.value);

        // Check if target reached
        if (pool.totalContributed >= pool.targetAmount) {
            pool.isActive = false;
            emit PoolCompleted(_poolId, pool.totalContributed);
        }
    }

    /**
     * @dev Withdraw from completed pool
     */
    function withdraw(uint256 _poolId) external {
        require(_poolId < pools.length, "Pool doesn't exist");
        Pool storage pool = pools[_poolId];
        Member storage member = poolMembers[_poolId][msg.sender];
        
        require(member.isMember, "Not a member");
        require(member.totalContributed > 0, "No contributions");
        
        // Simple withdrawal: members can withdraw their proportional share
        // In real-world, you'd implement rotating withdrawals or other logic
        bool canWithdraw = !pool.isActive || 
                          (block.timestamp >= pool.createdAt + pool.duration);
        require(canWithdraw, "Cannot withdraw yet");

        uint256 amount = member.totalContributed;
        member.totalContributed = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawal(_poolId, msg.sender, amount);
    }

    /**
     * @dev Get pool details
     */
    function getPool(uint256 _poolId) external view returns (
        string memory name,
        address creator,
        uint256 targetAmount,
        uint256 contributionAmount,
        uint256 totalContributed,
        uint256 memberCount,
        bool isActive
    ) {
        require(_poolId < pools.length, "Pool doesn't exist");
        Pool storage pool = pools[_poolId];
        
        return (
            pool.name,
            pool.creator,
            pool.targetAmount,
            pool.contributionAmount,
            pool.totalContributed,
            pool.members.length,
            pool.isActive
        );
    }

    /**
     * @dev Get member contribution
     */
    function getMemberContribution(uint256 _poolId, address _member) 
        external 
        view 
        returns (uint256) 
    {
        return poolMembers[_poolId][_member].totalContributed;
    }

    /**
     * @dev Get total number of pools
     */
    function getPoolCount() external view returns (uint256) {
        return pools.length;
    }

    /**
     * @dev Get all pool members
     */
    function getPoolMembers(uint256 _poolId) external view returns (address[] memory) {
        require(_poolId < pools.length, "Pool doesn't exist");
        return pools[_poolId].members;
    }
}
