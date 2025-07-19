import React from 'react'
import EditProfile from '../components/EditProfile'
import { useSelector } from 'react-redux'
import { Loader } from 'lucide-react'

const Profile = () => {
  const user = useSelector((store) => store.user)

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader className="animate-spin w-10 h-10 text-primary" />
      </div>
    )
  }

  return (
    <div>
      <EditProfile user={user} />
    </div>
  )
}

export default Profile
