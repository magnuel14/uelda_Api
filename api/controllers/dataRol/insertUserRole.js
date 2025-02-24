const models = require("../../models");
const UserRole = models.userRole;

/**
 * Inserts predefined roles into the database.
 */
let insertUserRoles = async function () {
    try {
        await UserRole.findOrCreate({
            where: { name: 'Rector/a' },
            defaults: { idUserRole: 1, status: 0, createdBy: 0, updatedBy: 0 }
        });

        await UserRole.findOrCreate({
            where: { name: 'Vicerrector/a' },
            defaults: { idUserRole: 2, status: 0, createdBy: 0, updatedBy: 0 }
        });

        await UserRole.findOrCreate({
            where: { name: 'Inspector/a' },
            defaults: { idUserRole: 3, status: 0, createdBy: 0, updatedBy: 0 }
        });

        await UserRole.findOrCreate({
            where: { name: 'Secretario/a' },
            defaults: { idUserRole: 4, status: 0, createdBy: 0, updatedBy: 0 }
        });

        await UserRole.findOrCreate({
            where: { name: 'Docente' },
            defaults: { idUserRole: 5, status: 0, createdBy: 0, updatedBy: 0 }
        });

        await UserRole.findOrCreate({
            where: { name: 'Estudiante' },
            defaults: { idUserRole: 6, status: 0, createdBy: 0, updatedBy: 0 }
        });

        console.log("Roles insertados correctamente.");
    } catch (error) {
        console.error("Error insertando roles:", error);
    }
};

insertUserRoles();
