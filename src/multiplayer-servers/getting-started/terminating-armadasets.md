# Terminating ArmadaSets

## Overview
GameFabric allows you to gracefully or forcefully terminate ArmadaSets. The GameFabric UI offers two options:
- **Terminate Unallocated**
- **Terminate All**

These options are either available in the Armada Overview:
![Armada_Terminate_Overview.png](images/armada/Armada_Terminate_Overview.png)

or in the respective details view:
![Armada_Terminate_Details.png](images/armada/Armada_Terminate_Details.png)

When you click the **Terminate** button, a pop-up will appear asking you to confirm the termination:
![Armada_Terminate_Modal.png](images/armada/Armada_Terminate_Modal.png)

::: info
Please note that terminating an ArmadaSet will not delete it. It will only terminate running game servers in the ArmadaSet. The Armada System will automatically restart everything implicitly once it detects the discrepancy between the existing capacity and the expected capacity.
:::

## Terminate Unallocated
The **Terminate Unallocated** option performs a **graceful** termination of all game servers in the ArmadaSet that are not currently allocated. This means that any game servers actively being played on will remain running, while those not in use will be restarted.

For more information about how allocation is tracked, see the [Using the Agones SDK](using-the-agones-sdk.md) section.

## Terminate All
The **Terminate All** option performs a **forceful** termination of all game servers in the ArmadaSet, regardless of whether they are allocated or not. This means that all running game servers will be restarted, even if they are currently being played on.