import { prismaDB } from "../db/db.config";

async function fixMissingTimestamps() {
  try {
    console.log("🔧 Fixing timestamps stored as strings in Product collection...");

    // Convert string timestamps to proper Date objects
    const result = await prismaDB.$runCommandRaw({
      update: "Product",
      updates: [
        {
          q: {},
          u: [
            {
              $set: {
                createdAt: {
                  $cond: {
                    if: { $eq: [{ $type: "$createdAt" }, "string"] },
                    then: { $toDate: "$createdAt" },
                    else: {
                      $cond: {
                        if: { $or: [{ $eq: ["$createdAt", null] }, { $eq: [{ $type: "$createdAt" }, "missing"] }] },
                        then: new Date(),
                        else: "$createdAt"
                      }
                    }
                  }
                },
                updatedAt: {
                  $cond: {
                    if: { $eq: [{ $type: "$updatedAt" }, "string"] },
                    then: { $toDate: "$updatedAt" },
                    else: {
                      $cond: {
                        if: { $or: [{ $eq: ["$updatedAt", null] }, { $eq: [{ $type: "$updatedAt" }, "missing"] }] },
                        then: new Date(),
                        else: "$updatedAt"
                      }
                    }
                  }
                },
                tags: {
                  $cond: {
                    if: { $or: [{ $eq: ["$tags", null] }, { $eq: [{ $type: "$tags" }, "missing"] }] },
                    then: [],
                    else: "$tags"
                  }
                }
              }
            }
          ],
          multi: true,
        },
      ],
    });

    console.log("✅ Fixed Product timestamps:", JSON.stringify(result, null, 2));

    // Fix OrderItems with string timestamps
    const orderItemsResult = await prismaDB.$runCommandRaw({
      update: "OrderItem",
      updates: [
        {
          q: {},
          u: [
            {
              $set: {
                createdAt: {
                  $cond: {
                    if: { $eq: [{ $type: "$createdAt" }, "string"] },
                    then: { $toDate: "$createdAt" },
                    else: {
                      $cond: {
                        if: { $or: [{ $eq: ["$createdAt", null] }, { $eq: [{ $type: "$createdAt" }, "missing"] }] },
                        then: new Date(),
                        else: "$createdAt"
                      }
                    }
                  }
                }
              }
            }
          ],
          multi: true,
        },
      ],
    });

    console.log("✅ Fixed OrderItems timestamps:", JSON.stringify(orderItemsResult, null, 2));

    console.log("✅ All fixes complete!");
  } catch (error) {
    console.error("❌ Error fixing timestamps:", error);
  } finally {
    await prismaDB.$disconnect();
  }
}

fixMissingTimestamps();
