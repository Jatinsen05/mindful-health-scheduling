import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { User } from './User.js';
import { Doctor } from './Doctor.js';

const PastAppointment = sequelize.define('PastAppointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Doctor, key: 'id' }
  },
  appointment_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  mode: {
    type: DataTypes.ENUM('offline', 'call', 'text', 'video'),
    allowNull: false
  },
  clinic_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'past_appointments',
  timestamps: false
});

// Associations
PastAppointment.belongsTo(User, { foreignKey: 'patient_id', as: 'patient' });
PastAppointment.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });

export { PastAppointment }; 