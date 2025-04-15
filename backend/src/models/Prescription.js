import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Appointment } from './Appointment.js';

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Appointment, key: 'id' }
  },
  medicine_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  dosage: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'prescriptions',
  timestamps: false
});

// Associations
Prescription.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });

export { Prescription }; 