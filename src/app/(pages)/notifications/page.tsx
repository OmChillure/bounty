// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Bell, MailOpen } from 'lucide-react';
// import { ScrollArea } from "@/components/ui/scroll-area"

// interface Notification {
//   id: string;
//   title: string;
//   cashback: number;
//   timestamp: string;
//   isNew?: boolean;
// }

// const NotificationsPage = () => {
//   const notifications: Notification[] = [
//     {
//       id: '1',
//       title: 'Cashback redeemed by user123',
//       cashback: 100,
//       timestamp: '2024-03-23 14:30',
//       isNew: true,
//     },
//     {
//       id: '2',
//       title: 'Cashback redeemed by user456',
//       cashback: 100,
//       timestamp: '2024-03-23 13:15',
//       isNew: true,
//     },
//     {
//       id: '3',
//       title: 'Cashback redeemed by user789',
//       cashback: 100,
//       timestamp: '2024-03-23 12:45',
//     },
//     {
//       id: '4',
//       title: 'Cashback redeemed by user123234',
//       cashback: 1040,
//       timestamp: '2024-03-23 12:45',
//     },
//     {
//       id: '5',
//       title: 'Cashback redeemed by user0987',
//       cashback: 1010,
//       timestamp: '2024-03-23 12:45',
//     },
//   ];

//   return (
//     <div className="min-h-screen p-6">
//       <div className="max-w-6xl mx-auto space-y-6">
//         <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 shadow-2xl">
//           <div className="absolute inset-0 bg-black/20"></div>
//           <div className="relative flex items-center justify-between">
//             <div className="flex items-center">
//               <Bell className="h-8 w-8 text-white/90 mr-4" />
//               <div>
//                 <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
//                 <p className="text-white/80">Keep track of your recent activities</p>
//               </div>
//             </div>
//             <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
//               <span className="text-white font-medium">
//                 {notifications.filter(n => n.isNew).length} new
//               </span>
//             </div>
//           </div>
//         </div>

//         <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-0 shadow-xl">
//           <CardHeader>
//             <CardTitle className="text-white flex items-center justify-between">
//               <div className="flex items-center">
//                 <MailOpen className="h-5 w-5 mr-2" />
//                 Recent Notifications
//               </div>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ScrollArea className="h-[400px] rounded-md" type="always">
//               <div className="space-y-4 pr-4">
//                 {notifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     <div className="p-4">
//                       <div className="flex justify-between items-start">
//                         <div className="space-y-2">
//                           <div className="flex items-center space-x-2">
//                             {notification.isNew && (
//                               <span className="flex h-2 w-2">
//                                 <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
//                                 <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
//                               </span>
//                             )}
//                             <h3 className="text-lg font-medium text-white">
//                               {notification.title}
//                             </h3>
//                           </div>
//                           <p className="text-sm text-gray-400">
//                             {notification.timestamp}
//                           </p>
//                         </div>
//                         <div className="flex items-center">
//                           <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium">
//                             Rs. {notification.cashback}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-blue-500"></div>
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-0 shadow-xl">
//           <CardHeader>
//             <CardTitle className="text-white flex items-center">
//               <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-4">
//                 <Bell className="h-6 w-6 text-white" />
//               </div>
//               Summary
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-2 gap-4 text-white/80">
//               <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-transparent">
//                 <p className="text-sm">New Notifications</p>
//                 <p className="text-2xl font-bold text-white">
//                   {notifications.filter(n => n.isNew).length}
//                 </p>
//               </div>
//               <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent">
//                 <p className="text-sm">Total Cashback</p>
//                 <p className="text-2xl font-bold text-white">
//                   Rs. {notifications.reduce((sum, n) => sum + n.cashback, 0)}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default NotificationsPage;

import React from 'react';

function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">Coming Soon</h1>
        <p className="text-xl text-blue-100 mb-8">Something amazing is in the works...</p>
        
        <div className="space-y-4">
          {/* <div className="w-16 h-16 border-t-4 border-white rounded-full animate-spin mx-auto"></div> */}
          <p className="text-blue-200">We are working hard to bring you something special</p>
        </div>
      </div>
    </div>
  );
}

export default Page;