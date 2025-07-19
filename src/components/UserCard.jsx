import React from 'react'

const UserCard = ({userInfo}) => {

    const {firstName, lastName, photoUrl, age, gender, about, skills} = userInfo;

  return (
    <div className="card bg-base-300 w-96 shadow-sm">

        <figure>
            <img
            src= {photoUrl}
            alt="user photo"
            className='w-full h-80 object-cover rounded-lg shadow'
             />
        </figure>
        <div className="card-body">
            <h2 className="card-title"> {firstName + " " + lastName} </h2>
            <p>
              {age && gender && `${age}, ${gender.charAt(0).toUpperCase() + gender.slice(1)}`}
            </p>

            <p> {about} </p>
            <p> {skills} </p>
            <div className="card-actions justify-center my-4">
            <button className="btn btn-primary">Ignore</button>
            <button className="btn btn-secondary">Interested</button>
            </div>
        </div>

</div>
  )
}

export default UserCard