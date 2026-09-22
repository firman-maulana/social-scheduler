import { useEffect, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import AccountList from '../components/AccountList';
import { dummyAccountsData } from '../assets/assets';
import PlatformPickerModal from '../components/PlatformPickerModal';

const PLATFORMS = [
  { id: "facebook", name: "Facebook", color: "bg-blue-600", icon: "https://cdn-icons-png.flaticon.com/512/124/124010.png" },
  { id: "instagram", name: "Instagram", color: "bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo.svg/800px-Instagram_logo.svg.png" },
  { id: "twitter", name: "Twitter", color: "bg-blue-400", icon: "https://cdn-icons-png.flaticon.com/512/145/145812.png" },
  { id: "linkedin", name: "LinkedIn", color: "bg-blue-700", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_2023.svg/800px-LinkedIn_logo_2023.svg.png" },
  { id: "tiktok", name: "TikTok", color: "bg-black", icon: "https://cdn-icons-png.flaticon.com/512/3046/3046487.png" },
  { id: "youtube", name: "YouTube", color: "bg-red-600", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282013-2017%29.svg/800px-YouTube_full-color_icon_%282013-2017%29.svg.png" },
]

const Accounts = () => {

  const [accounts, setAccounts] = useState<any[]>([])
  const [connecting, setConnecting] = useState<string | null>(null)
  const [showPlatformPicker, setShowPlatformPicker] = useState(false)

  const fetchAccounts = async (isSync = false, platform?: string | null, successMsg?: string) => {
    setAccounts(dummyAccountsData);
    console.log(isSync, platform, successMsg)
  }

  useEffect(() => {
    fetchAccounts();
  }, [])

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    setTimeout(()=>{
      setConnecting(null)
      setAccounts((prev)=> [...prev, dummyAccountsData[0]])
      setShowPlatformPicker(false)
    },1000)
  }

  const handleDisconnect = async (accountId: string) => {
    setAccounts(accounts.filter((a) => a._id !== accountId))
  }

  const connectedIds = accounts.map((a)=>a.platform)

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
        <div>
          <h2 className="text-xl text-slate-900">Connected Accounts</h2>
          <p className="text-slate-500 text-sm mt-0.5">{accounts.length} of {PLATFORMS.length} platforms connected</p>
        </div>
        <button onClick={() => setShowPlatformPicker(true)} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all w-full sm:w-auto justify-center">
          <PlusIcon className="size-4" /> Connect Account
        </button>
      </div>

      {/* Platform picker modal */}
      {showPlatformPicker && (
        <PlatformPickerModal
          connectedIds={connectedIds}
          connecting={connecting}
          onClose={() => setShowPlatformPicker(false)}
          onConnect={handleConnect}
        />
      )}

      {/* Connected accounts list */}
      <AccountList accounts={accounts} onDisconnect={handleDisconnect} />

    </div>
  )
}

export default Accounts;
