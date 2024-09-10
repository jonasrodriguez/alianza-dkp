Logs:
* `/on-time`: Saca los logs de los usuarios en el canal "RAID" suma dkps y lo pinta en el canal de ⁠on-time 
* `/logs [encounter]`: Saca los logs de logs de los usuarios en el canal "RAID" suma dkps que tengamos configurados para ese encounter y lo pinta en el canal que toque 
* `/add-log [@usuario] [logID]`: Añade a un usuario de discord al log especifiado y le suma los DKPs El log ID aparece en cada uno de los logs como un numero [#11]
* `/remove-log [@usuario] [logID]`: Elimina un usuario de discord al log especifiado y le resta los DKPs 
Bids:
* `/add-bid [@usuario] [Texto item] [dkps]`: Añade una bid para ese usuario, los dkps se descontaran automaticamente. El texto es descriptivo, no esta linkado al quarm db ni nada 
* `/add-compra [@usuario] [Texto item] [dkps]`: Añade una compra hecha al banco del clan. Mismo funcionamiento que con el `add-bid`
* `/remove-bid [bidID]`: Elimina un bid y descuenta los dkps. El id se sacada del mensaje de bids