'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  PencilIcon,
  KeyIcon,
  BellIcon
} from '@heroicons/react/24/outline'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  hireDate: string
  position: string
  department: string
  manager: string
  employeeId: string
  status: 'active' | 'inactive'
  profileImage?: string
}

interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email: string
}

const mockProfile: UserProfile = {
  id: '1',
  firstName: 'Alice',
  lastName: 'Johnson',
  email: 'alice.johnson@mozart.com',
  phone: '+33 1 23 45 67 89',
  address: '123 Rue de la Paix, 75001 Paris',
  dateOfBirth: '1990-05-15',
  hireDate: '2022-03-01',
  position: 'Développeur Senior',
  department: 'Informatique',
  manager: 'Jean Dupont',
  employeeId: 'EMP001',
  status: 'active'
}

const mockEmergencyContact: EmergencyContact = {
  name: 'Bob Johnson',
  relationship: 'Époux',
  phone: '+33 6 12 34 56 78',
  email: 'bob.johnson@email.com'
}

const departmentOptions = [
  { value: 'IT', label: 'Informatique' },
  { value: 'HR', label: 'Ressources Humaines' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Opérations' },
  { value: 'Sales', label: 'Ventes' }
]

const relationshipOptions = [
  { value: 'spouse', label: 'Époux/Épouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Frère/Sœur' },
  { value: 'friend', label: 'Ami(e)' },
  { value: 'other', label: 'Autre' }
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile)
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>(mockEmergencyContact)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingEmergency, setIsEditingEmergency] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  const [profileForm, setProfileForm] = useState(profile)
  const [emergencyForm, setEmergencyForm] = useState(emergencyContact)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    leaveReminders: true,
    timesheetReminders: true,
    scheduleChanges: true
  })

  const handleProfileSave = () => {
    setProfile(profileForm)
    setIsEditingProfile(false)
  }

  const handleEmergencySave = () => {
    setEmergencyContact(emergencyForm)
    setIsEditingEmergency(false)
  }

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Les mots de passe ne correspondent pas')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    alert('Mot de passe changé avec succès!')
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setIsChangingPassword(false)
  }

  const calculateYearsOfService = () => {
    const hireDate = new Date(profile.hireDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - hireDate.getTime())
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25))
    return diffYears
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600">{profile.position}</p>
                <div className="mt-2">
                  <Badge variant={profile.status === 'active' ? 'success' : 'error'}>
                    {profile.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <BriefcaseIcon className="h-4 w-4 mr-2" />
                    ID: {profile.employeeId}
                  </div>
                  <div className="flex items-center justify-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {calculateYearsOfService()} ans de service
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Congés restants</span>
                  <span className="text-sm font-medium">13 jours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Heures ce mois</span>
                  <span className="text-sm font-medium">152h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Performance</span>
                  <Badge variant="success">Excellent</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingProfile(!isEditingProfile)
                      if (!isEditingProfile) setProfileForm(profile)
                    }}
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    {isEditingProfile ? 'Annuler' : 'Modifier'}
                  </Button>
                </div>
              </div>
              <div className="p-6">
                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Prénom"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      />
                      <Input
                        label="Nom"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      />
                    </div>
                    <Input
                      label="Email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      icon={<EnvelopeIcon />}
                    />
                    <Input
                      label="Téléphone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      icon={<PhoneIcon />}
                    />
                    <Input
                      label="Adresse"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                      icon={<MapPinIcon />}
                    />
                    <Input
                      label="Date de naissance"
                      type="date"
                      value={profileForm.dateOfBirth}
                      onChange={(e) => setProfileForm({...profileForm, dateOfBirth: e.target.value})}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleProfileSave}>
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <div className="mt-1 flex items-center text-sm text-gray-900">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                          {profile.email}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                        <div className="mt-1 flex items-center text-sm text-gray-900">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                          {profile.phone}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                        <div className="mt-1 flex items-center text-sm text-gray-900">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                          {formatDate(profile.dateOfBirth)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Département</label>
                        <div className="mt-1 text-sm text-gray-900">{profile.department}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Manager</label>
                        <div className="mt-1 text-sm text-gray-900">{profile.manager}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date d'embauche</label>
                        <div className="mt-1 text-sm text-gray-900">{formatDate(profile.hireDate)}</div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Adresse</label>
                      <div className="mt-1 flex items-center text-sm text-gray-900">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {profile.address}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Contact d'urgence</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingEmergency(!isEditingEmergency)
                      if (!isEditingEmergency) setEmergencyForm(emergencyContact)
                    }}
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    {isEditingEmergency ? 'Annuler' : 'Modifier'}
                  </Button>
                </div>
              </div>
              <div className="p-6">
                {isEditingEmergency ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Nom"
                        value={emergencyForm.name}
                        onChange={(e) => setEmergencyForm({...emergencyForm, name: e.target.value})}
                      />
                      <Select
                        label="Relation"
                        value={emergencyForm.relationship}
                        onChange={(value) => setEmergencyForm({...emergencyForm, relationship: value as string})}
                        options={relationshipOptions}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Téléphone"
                        value={emergencyForm.phone}
                        onChange={(e) => setEmergencyForm({...emergencyForm, phone: e.target.value})}
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={emergencyForm.email}
                        onChange={(e) => setEmergencyForm({...emergencyForm, email: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditingEmergency(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleEmergencySave}>
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <div className="mt-1 text-sm text-gray-900">{emergencyContact.name}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Relation</label>
                      <div className="mt-1 text-sm text-gray-900">{emergencyContact.relationship}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                      <div className="mt-1 text-sm text-gray-900">{emergencyContact.phone}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <div className="mt-1 text-sm text-gray-900">{emergencyContact.email}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Sécurité</h3>
              </div>
              <div className="p-6">
                {isChangingPassword ? (
                  <div className="space-y-4">
                    <Input
                      label="Mot de passe actuel"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    />
                    <Input
                      label="Nouveau mot de passe"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    />
                    <Input
                      label="Confirmer le mot de passe"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handlePasswordChange}>
                        Changer le mot de passe
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <KeyIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Mot de passe</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Dernière modification: il y a 3 mois
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                      Changer le mot de passe
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <BellIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Notifications par email</div>
                      <div className="text-sm text-gray-500">Recevoir des emails pour les mises à jour importantes</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Rappels de congés</div>
                      <div className="text-sm text-gray-500">Rappels pour vos demandes de congés</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.leaveReminders}
                      onChange={(e) => setNotifications({...notifications, leaveReminders: e.target.checked})}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Rappels feuilles de temps</div>
                      <div className="text-sm text-gray-500">Rappels pour soumettre vos feuilles de temps</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.timesheetReminders}
                      onChange={(e) => setNotifications({...notifications, timesheetReminders: e.target.checked})}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Changements de planning</div>
                      <div className="text-sm text-gray-500">Notifications pour les modifications de planning</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.scheduleChanges}
                      onChange={(e) => setNotifications({...notifications, scheduleChanges: e.target.checked})}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}