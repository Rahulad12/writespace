import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useFollowAction } from '../hooks/useFollowAction';

interface FollowButtonProps {
  userId: string;
  onFollowChange?: () => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, onFollowChange }): React.ReactElement => {
  const { isAuthenticated } = useAuth();
  const { isFollowing, loading, toggleFollow, checkStatus } = useFollowAction(userId);

  useEffect(() => {
    if (isAuthenticated) {
      checkStatus();
    }
  }, [isAuthenticated, checkStatus]);

  if (!isAuthenticated) return <React.Fragment />;

  const handleClick = async (): Promise<void> => {
    await toggleFollow();
    onFollowChange?.();
  };

  return (
    <Button
      type={isFollowing ? 'default' : 'primary'}
      loading={loading}
      onClick={handleClick}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;
