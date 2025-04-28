import React from 'react'

const Messages = () => {
  return (
    <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 relative flex h-[85vh]">
            <div className="w-1/3 mx-auto flex flex-col border-r-2 border-gray-100">
                <h1 className="text-2xl font-bold">Messages</h1>
                <p className="text-gray-500">Aucun message trouvé</p>
            </div>

            <div className="w-2/3 mx-auto flex flex-col px-3 ">
                <h1 className="text-2xl font-bold">Aucun message trouvé</h1>
                <p className="text-gray-500">Vous n'avez pas encore de messages.</p>
            </div>
        </div>
    </div>
  )
}

export default Messages