export const mockTickets = [
  { id: 1,  number: 'INC0000064', title: 'No puede reservar turno del martes',            stateLabel: 'Resolved',    priorityLabel: 'High',     openedAt: '2026-05-01T10:00:00', updatedAt: '2026-05-01T12:00:00' },
  { id: 2,  number: 'INC0000063', title: 'No puede cancelar su clase de hoy',             stateLabel: 'In Progress', priorityLabel: 'High',     openedAt: '2026-05-02T09:00:00', updatedAt: '2026-05-02T11:00:00' },
  { id: 3,  number: 'INC0000062', title: 'Su turno no aparece en el sistema',             stateLabel: 'New',         priorityLabel: 'Moderate', openedAt: '2026-05-03T08:00:00', updatedAt: '2026-05-03T08:30:00' },
  { id: 4,  number: 'INC0000061', title: 'No recibió confirmación del turno',             stateLabel: 'Closed',      priorityLabel: 'Low',      openedAt: '2026-05-03T14:00:00', updatedAt: '2026-05-03T15:00:00' },
  { id: 5,  number: 'INC0000060', title: 'Quiere cambiar de profesora',                   stateLabel: 'On Hold',     priorityLabel: 'Moderate', openedAt: '2026-05-04T10:00:00', updatedAt: '2026-05-04T11:00:00' },
  { id: 6,  number: 'INC0000059', title: 'Error al iniciar sesión',                       stateLabel: 'Closed',      priorityLabel: 'High',     openedAt: '2026-04-28T09:00:00', updatedAt: '2026-04-29T10:00:00' },
  { id: 7,  number: 'INC0000058', title: 'Pago rechazado',                                stateLabel: 'In Progress', priorityLabel: 'High',     openedAt: '2026-04-30T16:00:00', updatedAt: '2026-05-01T09:00:00' },
  { id: 8,  number: 'INC0000057', title: 'No puede ver historial de clases',              stateLabel: 'New',         priorityLabel: 'Low',      openedAt: '2026-05-05T11:00:00', updatedAt: '2026-05-05T11:00:00' },
  { id: 9,  number: 'INC0000056', title: 'No puede acceder a su cuenta desde el celular', stateLabel: 'Escalado',    priorityLabel: 'High',     openedAt: '2026-05-06T09:00:00', updatedAt: '2026-05-06T10:00:00' },
  { id: 10, number: 'INC0000055', title: 'No puede cambiar su contraseña',                stateLabel: 'Resolved',    priorityLabel: 'Moderate', openedAt: '2026-05-07T10:00:00', updatedAt: '2026-05-07T14:00:00' },
  { id: 11, number: 'INC0000054', title: 'El sistema no le permite cancelar el turno',    stateLabel: 'Closed',      priorityLabel: 'High',     openedAt: '2026-05-07T11:00:00', updatedAt: '2026-05-08T09:00:00' },
  { id: 12, number: 'INC0000053', title: 'No recibió el mail de confirmación',            stateLabel: 'Resolved',    priorityLabel: 'Low',      openedAt: '2026-05-08T09:00:00', updatedAt: '2026-05-08T11:00:00' },
  { id: 13, number: 'INC0000052', title: 'Quiere reprogramar turno para la semana que viene', stateLabel: 'New',     priorityLabel: 'Moderate', openedAt: '2026-05-08T13:00:00', updatedAt: '2026-05-08T13:00:00' },
  { id: 14, number: 'INC0000051', title: 'Error al cargar el comprobante de pago',        stateLabel: 'On Hold',     priorityLabel: 'High',     openedAt: '2026-05-09T08:00:00', updatedAt: '2026-05-09T10:00:00' },
  { id: 15, number: 'INC0000050', title: 'No puede ver los turnos disponibles',           stateLabel: 'Escalado',    priorityLabel: 'High',     openedAt: '2026-05-09T09:00:00', updatedAt: '2026-05-09T11:00:00' },
];

export const mockMetricas = {
  ingresados: 15,
  resueltos: 6,
  noResueltos: 7,
  escalados: 2,
};

export const mockMetricasCalidad = {
  fallasPorModulo: [
    { modulo: 'Cancelación',        fallas: 5 },
    { modulo: 'Cambio de horario',  fallas: 4 },
    { modulo: 'Reserva de turno',   fallas: 3 },
    { modulo: 'Sin confirmación',   fallas: 2 },
    { modulo: 'Turno no aparece',   fallas: 1 },
  ],
};